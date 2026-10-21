import type { Section } from '../client.ts';

export async function audit(section: Section): Promise<void> {
	await section.call('GET', '/audit/logs');
}
