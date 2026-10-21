import type { Section } from '../client.ts';

const missing = 'deploy_missing';

export async function deployments(section: Section): Promise<void> {
	await section.call('POST', '/deployments', {
		body: { name: '', type: 'not-a-type' },
	});
	await section.call('GET', '/deployments');
	await section.call('GET', `/deployments/${missing}`);
	await section.call('GET', `/deployments/${missing}/config`);
	await section.call('PUT', `/deployments/${missing}/config`, {
		body: { BLNK_TRANSACTION_BATCH_SIZE: 1 },
	});
	await section.call('POST', `/deployments/${missing}/upgrade`);
	await section.call('DELETE', `/deployments/${missing}/destroy`);
}
