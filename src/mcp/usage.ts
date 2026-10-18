import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RAW_LINE_DAYS, lagosDate, lagosYesterday, olderThanDays } from './dates';

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

type StoredDay = {
	sessionClients: Record<string, string>;
	tools: Record<string, number>;
	pages: Record<string, { title: string; count: number }>;
	operations: Record<string, number>;
};

export type DailyReport = {
	date: string;
	sessions: number;
	clients: Record<string, number>;
	tools: Record<string, number>;
	pages: { path: string; title: string; count: number }[];
	operations: { name: string; count: number }[];
};

const usageDir = () => process.env.MCP_USAGE_DIR ?? join(process.cwd(), 'data');
const linesPath = () => join(usageDir(), 'mcp-usage.jsonl');
const dailyPath = () => join(usageDir(), 'mcp-usage-daily.json');

let queue: Promise<void> = Promise.resolve();

function enqueue(work: () => Promise<void>): Promise<void> {
	const run = queue.then(work, work);
	queue = run.then(
		() => undefined,
		() => undefined,
	);
	return run;
}

async function readLines(): Promise<UsageEvent[]> {
	try {
		const raw = await readFile(linesPath(), 'utf8');
		return raw
			.split('\n')
			.filter(Boolean)
			.flatMap((line) => {
				try {
					return [JSON.parse(line) as UsageEvent];
				} catch {
					return [];
				}
			});
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
		throw error;
	}
}

async function readDays(): Promise<Record<string, StoredDay>> {
	try {
		return JSON.parse(await readFile(dailyPath(), 'utf8')) as Record<string, StoredDay>;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
		throw error;
	}
}

function emptyDay(): StoredDay {
	return { sessionClients: {}, tools: {}, pages: {}, operations: {} };
}

function bump(map: Record<string, number>, key: string) {
	map[key] = (map[key] ?? 0) + 1;
}

export function toReport(date: string, day: StoredDay | undefined): DailyReport {
	const stored = day ?? emptyDay();
	const clients: Record<string, number> = {};
	for (const client of Object.values(stored.sessionClients)) bump(clients, client);
	const pages = Object.entries(stored.pages)
		.map(([path, page]) => ({ path, title: page.title, count: page.count }))
		.sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
	const operations = Object.entries(stored.operations)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
	return {
		date,
		sessions: Object.keys(stored.sessionClients).length,
		clients,
		tools: stored.tools,
		pages,
		operations,
	};
}

export async function recordUsage(event: UsageEvent): Promise<void> {
	await enqueue(async () => {
		await mkdir(usageDir(), { recursive: true });
		const kept = (await readLines()).filter((line) => !olderThanDays(line.time, RAW_LINE_DAYS));
		kept.push(event);
		await writeFile(linesPath(), `${kept.map((line) => JSON.stringify(line)).join('\n')}\n`);

		const days = await readDays();
		const date = lagosDate(new Date(event.time));
		const day = days[date] ?? emptyDay();
		day.sessionClients[event.session] = event.client;
		bump(day.tools, event.tool);
		if (event.pagePath && event.pageTitle) {
			const page = day.pages[event.pagePath] ?? { title: event.pageTitle, count: 0 };
			page.count += 1;
			page.title = event.pageTitle;
			day.pages[event.pagePath] = page;
		}
		if (event.operation) bump(day.operations, event.operation);
		days[date] = day;
		await writeFile(dailyPath(), `${JSON.stringify(days)}\n`);
	});
}

export async function yesterdayReport(now = new Date()): Promise<DailyReport> {
	const date = lagosYesterday(now);
	const days = await readDays();
	return toReport(date, days[date]);
}
