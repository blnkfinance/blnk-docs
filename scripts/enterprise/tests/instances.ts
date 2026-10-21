import { firstInstanceId, type Context, type Section } from '../client.ts';

export async function instances(ctx: Context, section: Section): Promise<void> {
	const listed = await section.call('GET', '/instances');
	const instanceId = listed.ok ? firstInstanceId(listed.body) : undefined;
	if (!listed.ok) return;
	if (!instanceId) {
		section.skip('GET /instances/{instance_id}', 'no connected instance');
		return;
	}
	ctx.instanceId = instanceId;
	await section.call('GET', `/instances/${instanceId}`);
}
