import { field, proxy, type Section } from '../client.ts';

export async function hooks(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/hooks', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const name = `enterprise-test-${stamp}`;
	let hookId: string | undefined;

	try {
		const created = await proxy(section, 'POST', '/hooks', {
			body: {
				name,
				url: 'https://example.com/enterprise-test',
				type: 'POST_TRANSACTION',
				active: false,
				timeout: 5,
				retry_count: 0,
			},
		});
		hookId = created.ok ? (field(created.body, 'hook_id') ?? field(created.body, 'id')) : undefined;
		await proxy(section, 'GET', '/hooks', { query: { type: 'POST_TRANSACTION' } });
		if (!hookId) {
			section.skip('GET /proxy/hooks/{hook_id}', 'register hook did not return a hook id');
			section.skip('PUT /proxy/hooks', 'register hook did not return a hook id');
			return;
		}
		await proxy(section, 'GET', `/hooks/${hookId}`);
		await proxy(section, 'PUT', '/hooks', {
			body: {
				name,
				url: 'https://example.com/enterprise-test-updated',
				type: 'POST_TRANSACTION',
				active: false,
				timeout: 10,
				retry_count: 1,
			},
		});
	} finally {
		if (hookId) await proxy(section, 'DELETE', `/hooks/${hookId}`);
	}
}
