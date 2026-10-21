import { field, proxy, type Section } from '../client.ts';

export async function identities(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/identities', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	let identityId: string | undefined;

	try {
		const created = await proxy(section, 'POST', '/identities', {
			body: {
				identity_type: 'individual',
				first_name: 'Enterprise',
				last_name: 'Test',
				email_address: `enterprise-test-${stamp}@example.com`,
				phone_number: `+1555${String(stamp).slice(-7)}`,
				category: 'customer',
				country: 'US',
			},
		});
		identityId = created.ok ? field(created.body, 'identity_id') : undefined;
		if (!identityId) {
			section.skip('GET /proxy/identities/{identity_id}', 'create identity did not return an identity id');
			return;
		}

		await proxy(section, 'GET', `/identities/${identityId}`);
		await proxy(section, 'PUT', `/identities/${identityId}`, {
			body: { first_name: 'EnterpriseUpdated' },
		});

		const one = await proxy(section, 'POST', `/identities/${identityId}/tokenize/EmailAddress`);
		const many = await proxy(section, 'POST', `/identities/${identityId}/tokenize`, {
			body: { fields: ['PhoneNumber'] },
		});
		await proxy(section, 'GET', `/identities/${identityId}/tokenized-fields`);
		if (one.ok) await proxy(section, 'GET', `/identities/${identityId}/detokenize/EmailAddress`);
		else section.skip('GET /proxy/identities/{identity_id}/detokenize/{field}', 'tokenize field failed');
		if (many.ok) {
			await proxy(section, 'POST', `/identities/${identityId}/detokenize`, {
				body: { fields: ['PhoneNumber'] },
			});
		} else {
			section.skip('POST /proxy/identities/{identity_id}/detokenize', 'tokenize identity failed');
		}
	} finally {
		if (identityId) await proxy(section, 'DELETE', `/identities/${identityId}`);
	}
}
