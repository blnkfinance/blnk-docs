import { field, record, rows, type Context, type Section } from '../client.ts';

export async function dataLake(ctx: Context, section: Section): Promise<void> {
	const instanceId = ctx.instanceId;
	if (!instanceId) {
		section.skip('GET /data/lake/schema', 'no connected instance');
		section.skip('POST /data/lake/queries', 'no connected instance');
		section.skip('GET /data/lake/queries/{query_id}', 'no connected instance');
		section.skip('GET /data/lake/queries', 'no connected instance');
		section.skip('PATCH /data/lake/queries/{query_id}', 'no connected instance');
		section.skip('PUT /data/lake/queries/{query_id}/schedule', 'no connected instance');
		section.skip('DELETE /data/lake/queries/{query_id}/schedule', 'no connected instance');
		section.skip('POST /data/lake/query', 'no connected instance');
		section.skip('GET /data/lake/query-runs', 'no connected instance');
		section.skip('GET /data/lake/query-runs/{run_id}', 'no connected instance');
		section.skip('DELETE /data/lake/queries/{query_id}', 'no connected instance');
		return;
	}

	await section.call('GET', '/data/lake/schema', { query: { instance_id: instanceId } });

	const stamp = Date.now();
	let queryId: string | undefined;

	try {
		const created = await section.call('POST', '/data/lake/queries', {
			body: {
				instance_id: instanceId,
				name: `enterprise-test-${stamp}`,
				description: 'Read-only check from the enterprise API test runner.',
				sql: 'SELECT 1 FROM ledgers',
				range_mode: 'rolling',
				rolling_days: 1,
			},
		});
		queryId = created.ok ? nestedId(created.body) : undefined;
		const queryPath = queryId ?? 'lake_query_missing';
		await section.call('GET', `/data/lake/queries/${queryPath}`);
		await section.call('GET', '/data/lake/queries', { query: { instance_id: instanceId } });

		if (!queryId) {
			await section.call('PATCH', `/data/lake/queries/${queryPath}`, {
				body: { description: 'Exposure check.' },
			});
			await section.call('PUT', `/data/lake/queries/${queryPath}/schedule`, {
				body: { cron_expression: '0 9 * * *', timezone: 'UTC', enabled: false },
			});
			await section.call('DELETE', `/data/lake/queries/${queryPath}/schedule`);
			await section.call('POST', '/data/lake/query', {
				body: {
					instance_id: instanceId,
					sql: 'SELECT 1 FROM ledgers',
					start_date: '2026-10-01',
					end_date: '2026-10-21',
				},
			});
			await section.call('GET', '/data/lake/query-runs', { query: { instance_id: instanceId } });
			await section.call('GET', '/data/lake/query-runs/lake_query_run_missing');
			await section.call('DELETE', `/data/lake/queries/${queryPath}`);
			return;
		}

		await section.call('PATCH', `/data/lake/queries/${queryId}`, {
			body: { description: 'Updated by the enterprise API test runner.' },
		});

		await section.call('PUT', `/data/lake/queries/${queryId}/schedule`, {
			body: {
				cron_expression: '0 9 * * *',
				timezone: 'UTC',
				enabled: false,
			},
		});
		await section.call('DELETE', `/data/lake/queries/${queryId}/schedule`);

		const run = await section.call('POST', '/data/lake/query', {
			body: {
				instance_id: instanceId,
				saved_query_id: queryId,
			},
		});
		const runs = await section.call('GET', '/data/lake/query-runs', {
			query: { instance_id: instanceId, query_id: queryId },
		});
		const runId = (run.ok ? nestedId(run.body, 'run_id') ?? nestedId(run.body) : undefined) ?? firstRunId(runs.body);
		if (runId) await section.call('GET', `/data/lake/query-runs/${runId}`);
		else section.skip('GET /data/lake/query-runs/{run_id}', 'the query run did not return a run id');
	} finally {
		if (queryId) await section.call('DELETE', `/data/lake/queries/${queryId}`);
	}
}

function nestedId(body: unknown, key = 'id'): string | undefined {
	return field(body, key) ?? field(record(body)?.data, key);
}

function firstRunId(body: unknown): string | undefined {
	return field(rows(body)[0], 'id');
}
