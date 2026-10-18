import { Pool } from 'pg';
import { RAW_LINE_DAYS, lagosYesterday } from './dates';
import { assembleReport, type DailyReport, type ReportRow } from './report';
import { sessionLogStatements } from './schema';

export type { DailyReport } from './report';
export { assembleReport } from './report';

export type UsageEvent = {
	time: string;
	tool: string;
	session: string;
	client: string;
	pagePath?: string;
	pageTitle?: string;
	operation?: string;
	query?: string;
	task?: string;
	filter?: string;
};

const DAY_REPORT = `
WITH day AS (
	SELECT *
	FROM mcp_session_log
	WHERE at >= ($1::date::timestamp AT TIME ZONE 'Africa/Lagos')
		AND at < ((($1::date + 1)::timestamp) AT TIME ZONE 'Africa/Lagos')
)
SELECT
	(SELECT COUNT(DISTINCT session)::int FROM day) AS sessions,
	(SELECT COALESCE(jsonb_object_agg(client, sessions), '{}'::jsonb) FROM (
		SELECT client, COUNT(DISTINCT session)::int AS sessions FROM day GROUP BY client
	) clients) AS clients,
	(SELECT COALESCE(jsonb_object_agg(tool, calls), '{}'::jsonb) FROM (
		SELECT tool, COUNT(*)::int AS calls FROM day GROUP BY tool
	) tools) AS tools,
	(SELECT COALESCE(jsonb_agg(jsonb_build_object('path', page_path, 'title', title, 'count', calls)), '[]'::jsonb) FROM (
		SELECT page_path, (array_agg(page_title ORDER BY at DESC))[1] AS title, COUNT(*)::int AS calls
		FROM day
		WHERE page_path IS NOT NULL AND page_title IS NOT NULL
		GROUP BY page_path
	) pages) AS pages,
	(SELECT COALESCE(jsonb_agg(jsonb_build_object('name', operation, 'count', calls)), '[]'::jsonb) FROM (
		SELECT operation, COUNT(*)::int AS calls
		FROM day
		WHERE operation IS NOT NULL
		GROUP BY operation
	) operations) AS operations
`;

let pool: Pool | undefined;
let ready: Promise<void> | undefined;

function database(): Pool {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL is not set');
	pool ??= new Pool({ connectionString, max: 1, idleTimeoutMillis: 0 });
	return pool;
}

async function readyPool(): Promise<Pool> {
	const current = database();
	ready ??= (async () => {
		for (const statement of sessionLogStatements) await current.query(statement);
	})().catch((error: unknown) => {
		ready = undefined;
		throw error;
	});
	await ready;
	return current;
}

export async function recordUsage(event: UsageEvent): Promise<void> {
	const current = await readyPool();
	const client = await current.connect();
	try {
		await client.query('BEGIN');
		await client.query(
			`INSERT INTO mcp_session_log (at, tool, session, client, page_path, page_title, operation, query, task, filter)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			[
				event.time,
				event.tool,
				event.session,
				event.client,
				event.pagePath ?? null,
				event.pageTitle ?? null,
				event.operation ?? null,
				event.query ?? null,
				event.task ?? null,
				event.filter ?? null,
			],
		);
		await client.query('DELETE FROM mcp_session_log WHERE at < now() - make_interval(days => $1)', [RAW_LINE_DAYS]);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function yesterdayReport(now = new Date()): Promise<DailyReport> {
	const date = lagosYesterday(now);
	const current = await readyPool();
	const result = await current.query<ReportRow>(DAY_REPORT, [date]);
	const row = result.rows[0];
	if (!row) return assembleReport(date, { sessions: 0, clients: null, tools: null, pages: null, operations: null });
	return assembleReport(date, row);
}
