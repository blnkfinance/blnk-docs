import { field, type Context, type Section } from '../client.ts';

export async function apps(ctx: Context, section: Section): Promise<void> {
	const stamp = Date.now();
	let slug: string | undefined;
	let registered = false;

	try {
		const created = await section.call('POST', '/apps', {
			body: {
				name: `Enterprise test ${stamp}`,
				is_private: true,
				registration_callback_url: 'https://example.com/enterprise-test',
				description: 'Temporary app created by the enterprise API test runner.',
				developer_name: 'Enterprise API test',
			},
		});
		registered = created.ok;
		slug = created.ok ? field(created.body, 'slug') : undefined;

		await section.call('GET', '/apps');

		if (slug) {
			await section.call('GET', `/apps/${slug}`);
			await section.call('PATCH', `/apps/${slug}`, {
				body: { description: 'Updated by the enterprise API test runner.' },
			});
		} else {
			const reason = registered ? 'register app did not return a slug' : 'register app failed';
			section.skip('GET /apps/{slug}', reason);
			section.skip('PATCH /apps/{slug}', reason);
			if (registered) section.skip('DELETE /apps/{slug}', reason);
		}
	} finally {
		if (slug) await section.call('DELETE', `/apps/${slug}`);
	}

	const instanceId = ctx.instanceId ?? 'instance_missing';
	await section.call('POST', '/apps/missing-slug/install', {
		query: { instance_id: instanceId },
		body: { instance_id: instanceId, password: 'exposure-check' },
	});
	await section.call('POST', '/apps/installed/instapp_missing/portal');
	await section.call('POST', '/apps/installed/instapp_missing/uninstall');
}
