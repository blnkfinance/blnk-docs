export type DailyReport = {
	date: string;
	sessions: number;
	clients: Record<string, number>;
	tools: Record<string, number>;
	pages: { path: string; title: string; count: number }[];
	operations: { name: string; count: number }[];
};

type Count = number | string;

export type ReportRow = {
	sessions: Count;
	clients: Record<string, Count> | null;
	tools: Record<string, Count> | null;
	pages: { path: string; title: string; count: Count }[] | null;
	operations: { name: string; count: number | string }[] | null;
};

function counts(source: Record<string, Count> | null): Record<string, number> {
	const map: Record<string, number> = {};
	for (const [name, count] of Object.entries(source ?? {})) map[name] = Number(count);
	return map;
}

export function assembleReport(date: string, row: ReportRow): DailyReport {
	const pages = (row.pages ?? [])
		.map((page) => ({ path: page.path, title: page.title, count: Number(page.count) }))
		.sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
	const operations = (row.operations ?? [])
		.map((operation) => ({ name: operation.name, count: Number(operation.count) }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
	return {
		date,
		sessions: Number(row.sessions),
		clients: counts(row.clients),
		tools: counts(row.tools),
		pages,
		operations,
	};
}
