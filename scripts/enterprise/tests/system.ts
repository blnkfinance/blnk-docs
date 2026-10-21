import { proxy, type Section } from '../client.ts';

export async function system(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('GET /proxy/health', 'no connected instance');
		return;
	}

	await proxy(section, 'GET', '/health');
	await proxy(section, 'GET', '/metrics');
}
