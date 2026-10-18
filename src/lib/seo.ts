import { getCollection, type CollectionEntry } from 'astro:content';
import { enterpriseNotice, isDropdown, itemPath, navigation, pageHref, pagePaths, tabGroups, type NavGroup, type NavItem } from '../ui/navigation';

export const siteName = 'Blnk';
export const siteTitle = 'Blnk Docs';
export const ogImagePath = '/og.png';
export const ogImageAlt = 'Blnk documentation';
export const ogImageWidth = 602;
export const ogImageHeight = 339;

const llmsIntro = 'Developer documentation for the Blnk ledger.';

export function requireSite(site: URL | undefined): URL {
	if (!site) throw new Error('Set site in astro.config.ts');
	return site;
}

export function absoluteUrl(path: string, site: URL): string {
	return new URL(path, site).href;
}

export function canonicalPath(pathname: string): string {
	if (pathname !== '/' && pathname.endsWith('/')) return pathname.slice(0, -1);
	return pathname || '/';
}

function present(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

const properNouns: Record<string, string> = {
	blnk: 'Blnk',
	core: 'Core',
	cloud: 'Cloud',
	watch: 'Watch',
	typesense: 'Typesense',
	git: 'Git',
	amazon: 'Amazon',
	oauth: 'OAuth',
	typescript: 'TypeScript',
	python: 'Python',
	java: 'Java',
	go: 'Go',
	joins: 'JOINs',
	https: 'HTTPS',
};

/** Sentence case for the document title. Product names and acronyms stay capitalized. */
export function sentenceCaseTitle(value: string): string {
	const tokens = value.trim().split(/\s+/);
	return tokens
		.map((token, index) => {
			const formatted = formatTitleToken(token, index);
			const previous = tokens[index - 1]?.replace(/[^A-Za-z]/g, '');
			if (index > 0 && /^data$/i.test(previous ?? '') && /^lake$/i.test(token.replace(/[^A-Za-z]/g, ''))) {
				return formatted.replace(/lake/i, 'Lake');
			}
			return formatted;
		})
		.join(' ');
}

function formatTitleToken(token: string, index: number): string {
	if (/^v?\d/i.test(token)) return token;
	if (!token.includes('-')) return formatTitleWord(token, index);
	return token
		.split('-')
		.map((part, partIndex) => formatTitleWord(part, index + partIndex))
		.join('-');
}

function formatTitleWord(token: string, index: number): string {
	const match = token.match(/^([^A-Za-z0-9]*)([A-Za-z0-9]*)([\s\S]*)$/);
	if (!match || !match[2]) return token;
	const [, prefix, core, rest] = match;
	const lower = core.toLowerCase();
	const proper = properNouns[lower];
	if (proper) return `${prefix}${proper}${rest}`;
	if (core.length >= 2 && core === core.toUpperCase() && /[A-Z]/.test(core)) return token;
	const cased =
		index === 0 && /^\p{L}/u.test(lower) ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
	return `${prefix}${cased}${rest}`;
}

/** Document title, og:title, and twitter:title. */
export function documentTitle(title: string): string {
	return `${sentenceCaseTitle(title)} – ${siteTitle}`;
}

/** First word capitalized, later words lowercase. All-caps tokens such as API stay as written. */
export function sentenceCase(value: string): string {
	return value
		.trim()
		.split(/\s+/)
		.map((word, index) => {
			const letters = word.replace(/[^A-Za-z]/g, '');
			if (letters.length >= 2 && letters === letters.toUpperCase()) return word;
			const lower = word.toLowerCase();
			if (index > 0) return lower;
			const at = lower.search(/\p{L}/u);
			if (at < 0) return lower;
			return lower.slice(0, at) + lower.charAt(at).toUpperCase() + lower.slice(at + 1);
		})
		.join(' ');
}

/** Sidebar label. `sidebarTitle` when set, otherwise the page title in sentence case. */
export function sidebarLabel(sidebarTitle: string | undefined, title: string): string {
	return present(sidebarTitle) ?? sentenceCase(title);
}

export function metaDescription(meta: string | undefined, description: string): string {
	return present(meta) ?? description;
}

export function markdownPath(href: string): string {
	return href === '/' ? '/index.md' : `${href}.md`;
}

export function pageMarkdown(
	title: string,
	description: string,
	body: string | undefined,
	notice?: string,
): string {
	return [`# ${title}`, description.trim(), notice?.trim() ?? '', body?.trim() ?? ''].filter(Boolean).join('\n\n');
}

export type IndexablePage = {
	id: string;
	href: string;
	markdownHref: string;
	title: string;
	description: string;
	markdown: string;
};

function toPage(entry: CollectionEntry<'docs'>): IndexablePage {
	const href = pageHref(entry.id);
	const description = metaDescription(entry.data.metaDescription, entry.data.description);
	return {
		id: entry.id,
		href,
		markdownHref: markdownPath(href),
		title: entry.data.title,
		description,
		markdown: pageMarkdown(
			entry.data.title,
			description,
			entry.body,
			enterpriseNotice(entry.data.enterprise),
		),
	};
}

export function indexablePages(entries: CollectionEntry<'docs'>[]): IndexablePage[] {
	const byId = new Map(entries.filter((entry) => !entry.data.noindex).map((entry) => [entry.id, entry]));
	const ordered: IndexablePage[] = [];
	const seen = new Set<string>();
	for (const id of pagePaths(navigation)) {
		const entry = byId.get(id);
		if (!entry || seen.has(id)) continue;
		seen.add(id);
		ordered.push(toPage(entry));
	}
	for (const entry of entries) {
		if (entry.data.noindex || seen.has(entry.id)) continue;
		seen.add(entry.id);
		ordered.push(toPage(entry));
	}
	return ordered;
}

export async function loadIndexablePages(): Promise<IndexablePage[]> {
	return indexablePages(await getCollection('docs'));
}

function pageIds(items: NavItem[]): string[] {
	const ids: string[] = [];
	for (const item of items) {
		const id = itemPath(item);
		if (id) ids.push(id);
		if (isDropdown(item)) ids.push(...pageIds(item.pages));
	}
	return ids;
}

function oneLine(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

export function llmsDirectory(pages: IndexablePage[], site: URL): string {
	const byId = new Map(pages.map((page) => [page.id, page]));
	const used = new Set<string>();
	const lines = [
		`# ${siteName}`,
		'',
		`> ${llmsIntro}`,
		'',
		`Full documentation: ${absoluteUrl('/llms-full.txt', site)}`,
		'',
	];

	function bullets(ids: string[]) {
		for (const id of ids) {
			const page = byId.get(id);
			if (!page || used.has(id)) continue;
			used.add(id);
			const link = absoluteUrl(page.markdownHref, site);
			lines.push(`- [${oneLine(page.title)}](${link}): ${oneLine(page.description)}`);
		}
	}

	function writeSection(heading: string, groups: NavGroup[]) {
		const present = groups
			.map((group) => ({
				name: group.group,
				ids: pageIds(group.pages).filter((id) => byId.has(id) && !used.has(id)),
			}))
			.filter((group) => group.ids.length > 0);
		if (present.length === 0) return;
		lines.push(`## ${heading}`, '');
		if (present.length === 1) {
			bullets(present[0].ids);
			lines.push('');
			return;
		}
		for (const group of present) {
			lines.push(`### ${group.name}`, '');
			bullets(group.ids);
			lines.push('');
		}
	}

	const root = navigation.navigation.root;
	if (root.groups.length === 1) writeSection(root.groups[0].group, root.groups);
	else {
		for (const group of root.groups) writeSection(group.group, [group]);
	}
	for (const tab of navigation.navigation.tabs) writeSection(tab.tab, tabGroups(tab));

	const rest = pages.filter((page) => !used.has(page.id));
	if (rest.length > 0) {
		lines.push('## More', '');
		for (const page of rest) {
			lines.push(`- [${oneLine(page.title)}](${absoluteUrl(page.markdownHref, site)}): ${oneLine(page.description)}`);
		}
		lines.push('');
	}

	return `${lines.join('\n').trim()}\n`;
}

export function llmsFull(pages: IndexablePage[], site: URL): string {
	return `${pages.map((page) => `${page.markdown}\n\n${absoluteUrl(page.href, site)}`).join('\n\n---\n\n')}\n`;
}

export function xmlEscape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
