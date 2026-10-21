import { field, type Context, type Section } from '../client.ts';

export async function agents(ctx: Context, section: Section): Promise<void> {
	const instanceId = ctx.instanceId;
	if (!instanceId) {
		section.skip('POST /agents/jobs', 'no connected instance');
		section.skip('GET /agents/jobs/{job_id}/status', 'no connected instance');
		section.skip('GET /agents/jobs/{job_id}/result', 'no connected instance');
		section.skip('POST /agents/jobs/{job_id}/control', 'no connected instance');
		return;
	}

	const created = await section.call('POST', '/agents/jobs', {
		query: { instance_id: instanceId },
		body: {
			message: 'How many ledgers are there? Read only. Do not create or change anything.',
			config: {
				skip_approval: true,
				approved_tools: ['filter.ledgers'],
			},
		},
	});
	const jobId = (created.ok ? field(created.body, 'job_id') : undefined) ?? 'job_missing';
	await section.call('GET', `/agents/jobs/${jobId}/status`);
	await section.call('GET', `/agents/jobs/${jobId}/result`);
	await section.call('POST', `/agents/jobs/${jobId}/control`, {
		body: { action: 'pause' },
	});
}
