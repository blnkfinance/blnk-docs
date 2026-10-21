import { field, proxy, type Section } from '../client.ts';

export async function apiKeys(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/api-keys', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const owner = `enterprise-test-${stamp}`;
	let keyId: string | undefined;

	try {
		const created = await proxy(section, 'POST', '/api-keys', {
			body: {
				name: `enterprise-test-${stamp}`,
				owner,
				scopes: ['ledgers:read'],
				expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
			},
		});
		keyId = created.ok ? field(created.body, 'api_key_id') : undefined;
		await proxy(section, 'GET', '/api-keys');
		if (!keyId) {
			section.skip('DELETE /proxy/api-keys/{id}', 'create API key did not return an api key id');
			return;
		}
	} finally {
		if (keyId) await proxy(section, 'DELETE', `/api-keys/${keyId}`, { query: { owner } });
	}
}
