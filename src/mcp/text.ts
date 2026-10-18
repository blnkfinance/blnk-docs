export const AREAS = ['Core', 'API', 'SDKs & CLI', 'Watch'] as const;
export type Area = (typeof AREAS)[number];

export const READ_LIMIT = 200;
export const LIST_LIMIT = 40;
export const SEARCH_LIMIT = 10;

export function pagePath(input: string): string {
	let path = input.trim().replace(/\.mdx?$/i, '');
	if (!path.startsWith('/')) path = `/${path}`;
	if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
	return path || '/';
}

export function endpointPath(input: string): string {
	const path = input.trim();
	if (!path.startsWith('/')) return `/${path}`;
	return path;
}

export function sliceLines(text: string, offset = 1, limit = READ_LIMIT): { text: string; remaining: number; nextOffset?: number } {
	const lines = text.split('\n');
	const start = Math.max(0, Math.floor(offset) - 1);
	const chunk = lines.slice(start, start + limit);
	const next = start + chunk.length;
	const remaining = Math.max(0, lines.length - next);
	return {
		text: chunk.join('\n'),
		remaining,
		nextOffset: remaining > 0 ? next + 1 : undefined,
	};
}

/** The section under a heading, through the line before the next heading of the same or higher level. */
export function sectionUnder(markdown: string, heading: string): string | undefined {
	const lines = markdown.split('\n');
	const wanted = heading.trim().toLowerCase();
	let start = -1;
	let level = 0;
	for (let index = 0; index < lines.length; index++) {
		const match = /^(#{1,6})\s+(.*?)\s*$/.exec(lines[index] ?? '');
		if (!match) continue;
		const text = match[2]?.replace(/\s+#+\s*$/, '').trim().toLowerCase() ?? '';
		if (start < 0 && text === wanted) {
			start = index;
			level = match[1]?.length ?? 1;
			continue;
		}
		if (start >= 0 && (match[1]?.length ?? 1) <= level) return lines.slice(start, index).join('\n');
	}
	if (start >= 0) return lines.slice(start).join('\n');
	return undefined;
}

export function readNote(remaining: number, nextOffset: number | undefined): string {
	if (!nextOffset || remaining <= 0) return '';
	const lines = remaining === 1 ? '1 line remains' : `${remaining} lines remain`;
	return `\n\n${lines}. Call read_page again with offset ${nextOffset}, or pass heading for one section.`;
}

function terms(query: string): string[] {
	return query
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((term) => term.length > 1);
}

function fieldScore(text: string, queryTerms: string[], weight: number): number {
	const hay = text.toLowerCase();
	let score = 0;
	for (const term of queryTerms) {
		if (hay.includes(term)) score += weight;
	}
	return score;
}

export function searchScore(title: string, description: string, markdown: string, query: string): number {
	const queryTerms = terms(query);
	if (queryTerms.length === 0) return 0;
	let score = fieldScore(title, queryTerms, 8) + fieldScore(description, queryTerms, 4) + fieldScore(markdown, queryTerms, 1);
	const phrase = query.trim().toLowerCase();
	if (phrase.length > 2 && (title.toLowerCase().includes(phrase) || description.toLowerCase().includes(phrase))) score += 6;
	return score;
}

export function snippet(description: string, markdown: string, query: string): string {
	const needle = terms(query)[0];
	const source = needle && description.toLowerCase().includes(needle) ? description : markdown;
	const hay = source.toLowerCase();
	const at = needle ? hay.indexOf(needle) : 0;
	const start = Math.max(0, at - 60);
	const cut = source.slice(start, start + 180).replace(/\s+/g, ' ').trim();
	return start > 0 ? `…${cut}` : cut;
}

export function isArea(value: string): value is Area {
	return (AREAS as readonly string[]).includes(value);
}
