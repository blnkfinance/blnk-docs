import { field, type Section } from '../client.ts';

const financePermissions = [
	'billing.read',
	'billing.report',
	'data.read',
	'instances.read',
	'org.read',
	'audit.read',
];

const compliancePermissions = [
	'alerts.read',
	'alerts.write',
	'anomalies.read',
	'data.read',
	'audit.read',
	'instances.read',
];

export async function accessControl(section: Section): Promise<void> {
	await section.call('GET', '/organizations/members');
	await section.call('GET', '/organizations/roles');

	const stamp = Date.now();
	const financeSlug = `enterprise-test-finance-ops-${stamp}`;
	const complianceSlug = `enterprise-test-compliance-${stamp}`;
	let financeId: string | undefined;
	let complianceId: string | undefined;

	try {
		const finance = await section.call('POST', '/organizations/roles', {
			body: {
				slug: financeSlug,
				name: 'Finance ops',
				description: 'Read billing, ledger data, instances, and the audit log.',
				permissions: financePermissions,
			},
		});
		financeId = finance.ok ? field(finance.body, 'role_id') : undefined;
		if (finance.ok && !financeId) {
			section.skip('PUT /organizations/roles/{role_id}', 'create role did not return a role id');
			section.skip(`DELETE /organizations/roles/${financeSlug}`, 'create role did not return a role id');
		}

		const compliance = await section.call('POST', '/organizations/roles', {
			body: {
				slug: complianceSlug,
				name: 'Compliance',
				description: 'Work alerts and read ledger data, instances, and the audit log.',
				permissions: compliancePermissions,
			},
		});
		complianceId = compliance.ok ? field(compliance.body, 'role_id') : undefined;
		if (compliance.ok && !complianceId) {
			section.skip(`DELETE /organizations/roles/${complianceSlug}`, 'create role did not return a role id');
		}

		if (financeId) {
			await section.call('PUT', `/organizations/roles/${financeId}`, {
				body: {
					slug: financeSlug,
					name: 'Finance ops',
					description: 'Read billing, ledger data, instances, members, and the audit log.',
					permissions: [...financePermissions, 'members.read'],
				},
			});
		}
	} finally {
		if (financeId) await section.call('DELETE', `/organizations/roles/${financeId}`);
		if (complianceId) await section.call('DELETE', `/organizations/roles/${complianceId}`);
	}

	await section.call('PUT', '/organizations/members/user_missing/role', {
		body: { role: 'admin' },
	});
	await section.call('GET', '/oauth/authorize', {
		query: {
			response_type: 'code',
			client_id: 'missing',
			redirect_uri: 'https://example.com/enterprise-test',
		},
	});
	await section.call('POST', '/oauth/token', {
		body: {
			grant_type: 'authorization_code',
			code: 'missing',
			redirect_uri: 'https://example.com/enterprise-test',
			client_id: 'missing',
			client_secret: 'missing',
		},
	});
}
