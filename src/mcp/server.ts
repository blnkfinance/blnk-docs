import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import guide from './orient.md?raw';
import type { DocPage } from './corpus';
import { loadCorpus } from './corpus';
import { recordUsage, type UsageEvent } from './usage';
import { AREAS, LIST_LIMIT, SEARCH_LIMIT, endpointPath, pagePath, readNote, searchScore, sectionUnder, sliceLines, snippet } from './text';

const INSTRUCTIONS = [
	'Call orient on a new task, then search, list_pages, or get_operation, then read_page.',
	'Pass design to orient when the ledger shape is still open.',
	'Pass implement when the task is to post, hold, or confirm a movement.',
	'API reference beats a tutorial when they disagree.',
	'Do not invent endpoints, fields, or statuses.',
].join(' ');

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

type Track = Omit<UsageEvent, 'time' | 'tool' | 'session' | 'client'>;

function textResult(text: string, isError = false): CallToolResult {
	return { content: [{ type: 'text', text }], isError };
}

function taskGuide(task: string): string | undefined {
	const sections = guide.split(/^# /m).slice(1);
	for (const section of sections) {
		const [name, ...rest] = section.split('\n');
		if (name?.trim() === task) return rest.join('\n').trim();
	}
	return undefined;
}

function sdkName(id: string): string {
	const language = id.split('/')[1];
	if (language === 'typescript') return 'TypeScript';
	if (language === 'python') return 'Python';
	if (language === 'go') return 'Go';
	if (language === 'java') return 'Java';
	return language ?? 'SDK';
}

function operationText(pages: DocPage[]): string {
	const api = pages.filter((page) => page.area === 'API' || page.id.startsWith('reference/'));
	const sdk = pages.filter((page) => !api.includes(page));
	const lines: string[] = [];
	function write(heading: string, group: DocPage[]) {
		if (group.length === 0) return;
		lines.push(heading);
		for (const page of group) {
			const flag = page.enterprise ? ` (${page.enterprise})` : '';
			lines.push(`- ${page.title}${flag}: ${page.href}`);
		}
	}
	write('API', api);
	write('SDKs', sdk.map((page) => ({ ...page, title: `${sdkName(page.id)}: ${page.title}` })));
	return lines.join('\n');
}

export async function createMcpServer(): Promise<McpServer> {
	const pages = await loadCorpus();
	const byHref = new Map(pages.map((page) => [page.href, page]));
	const server = new McpServer({ name: 'blnk-docs', version: '1.0.0' }, { instructions: INSTRUCTIONS });

	async function track(extra: { sessionId?: string }, tool: string, fields: Track, result: CallToolResult): Promise<CallToolResult> {
		if (result.isError) return result;
		try {
			const client = server.server.getClientVersion()?.name || 'unknown';
			await recordUsage({
				time: new Date().toISOString(),
				tool,
				session: extra.sessionId ?? `once:${crypto.randomUUID()}`,
				client,
				...fields,
			});
		} catch (error) {
			console.error('mcp usage write failed', error);
		}
		return result;
	}

	server.registerTool(
		'search',
		{
			title: 'Search the docs',
			description: 'Search Blnk docs. Returns at most 10 pages, ranked by title and description. Optional area is Core, Learn, API, SDKs & CLI, or Watch.',
			inputSchema: { query: z.string().min(1), area: z.enum(AREAS).optional() },
			annotations: readOnly,
		},
		async ({ query, area }, extra) => {
			const ranked = pages
				.filter((page) => !area || page.area === area)
				.map((page) => ({ page, score: searchScore(page.title, page.description, page.markdown, query) }))
				.filter((hit) => hit.score > 0)
				.sort((a, b) => b.score - a.score || a.page.href.localeCompare(b.page.href))
				.slice(0, SEARCH_LIMIT);
			const body =
				ranked.length === 0
					? 'No pages matched. Try list_pages or a shorter query.'
					: ranked
							.map(({ page }) => {
								const place = [page.area, page.group].filter(Boolean).join(' / ');
								return [`- ${page.title}`, `  ${page.href}`, place ? `  ${place}` : '', `  ${snippet(page.description, page.markdown, query)}`]
									.filter(Boolean)
									.join('\n');
							})
							.join('\n\n');
			return track(extra, 'search', { query }, textResult(body));
		},
	);

	server.registerTool(
		'read_page',
		{
			title: 'Read a page',
			description:
				'Read a docs page as Markdown, including pages marked noindex. Without heading, returns the first 200 lines. Pass heading for one section, or offset as a 1-based line number to continue.',
			inputSchema: { path: z.string().min(1), heading: z.string().optional(), offset: z.number().int().positive().optional() },
			annotations: readOnly,
		},
		async ({ path, heading, offset }, extra) => {
			const page = byHref.get(pagePath(path));
			if (!page) return textResult(`No page at ${pagePath(path)}. Use search or list_pages.`, true);
			const source = heading ? sectionUnder(page.markdown, heading) : page.markdown;
			if (source === undefined) return textResult(`No heading "${heading}" on ${page.href}.`, true);
			const slice = sliceLines(source, offset ?? 1);
			const body = `${slice.text}${readNote(slice.remaining, slice.nextOffset)}`;
			return track(extra, 'read_page', { pagePath: page.href, pageTitle: page.title }, textResult(body));
		},
	);

	server.registerTool(
		'list_pages',
		{
			title: 'List pages',
			description:
				'List docs pages in nav order: title, path, and description. Filter with area (Core, Learn, API, SDKs & CLI, Watch) or group (a sidebar group name). Returns 40 pages. Pass the cursor to continue.',
			inputSchema: { area: z.enum(AREAS).optional(), group: z.string().optional(), cursor: z.string().optional() },
			annotations: readOnly,
		},
		async ({ area, group, cursor }, extra) => {
			const filtered = pages.filter((page) => {
				if (area && page.area !== area) return false;
				if (group && page.group.toLowerCase() !== group.toLowerCase()) return false;
				return true;
			});
			const start = cursor ? Number.parseInt(cursor, 10) : 0;
			if (!Number.isInteger(start) || start < 0 || start > filtered.length) return textResult('That cursor is not valid. Call list_pages again without one.', true);
			const slice = filtered.slice(start, start + LIST_LIMIT);
			const next = start + slice.length;
			const lines = slice.map((page) => `- ${page.title}\n  ${page.href}\n  ${page.description}`);
			if (next < filtered.length) lines.push('', `cursor: ${next}`);
			const filter = [area, group].filter(Boolean).join(' / ');
			return track(extra, 'list_pages', filter ? { filter } : {}, textResult(lines.join('\n')));
		},
	);

	server.registerTool(
		'get_operation',
		{
			title: 'Look up an operation',
			description: 'Given an HTTP method and path, return the API page first, then any SDK page for that same operation. Each line includes the docs path for read_page.',
			inputSchema: {
				method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
				path: z.string().min(1),
			},
			annotations: readOnly,
		},
		async ({ method, path }, extra) => {
			const endpoint = endpointPath(path);
			const matches = pages.filter((page) => page.method === method && page.endpoint === endpoint);
			if (matches.length === 0) return textResult(`No docs page for ${method} ${endpoint}.`, true);
			const ordered = [...matches.filter((page) => page.id.startsWith('reference/')), ...matches.filter((page) => !page.id.startsWith('reference/'))];
			return track(extra, 'get_operation', { operation: `${method} ${endpoint}` }, textResult(`${method} ${endpoint}\n\n${operationText(ordered)}`));
		},
	);

	server.registerTool(
		'orient',
		{
			title: 'How to read Blnk',
			description: 'How to read Blnk before you search. task is lookup (the default), design, or implement.',
			inputSchema: { task: z.enum(['lookup', 'design', 'implement']).optional() },
			annotations: readOnly,
		},
		async ({ task }, extra) => {
			const name = task ?? 'lookup';
			const body = taskGuide(name);
			if (!body) return textResult('task must be lookup, design, or implement.', true);
			return track(extra, 'orient', { task: name }, textResult(body));
		},
	);

	return server;
}
