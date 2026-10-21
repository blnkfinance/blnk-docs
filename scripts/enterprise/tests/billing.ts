import type { Context, Section } from '../client.ts';

export async function billing(ctx: Context, section: Section): Promise<void> {
	await section.call('GET', '/billing/org');
	await section.call('GET', '/billing/overview');
	await section.call('GET', '/billing/invoices');
	await section.call('GET', '/billing/usage-billing');

	if (ctx.instanceId) {
		await section.call('GET', '/data/record-counts', {
			query: { instance_id: ctx.instanceId },
		});
	} else {
		section.skip('GET /data/record-counts', 'no connected instance');
	}

	section.skip('POST /billing/usage-billing', 'the API cannot turn usage billing off');
}
