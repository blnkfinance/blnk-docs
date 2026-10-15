import { getCollection, type CollectionEntry } from 'astro:content';
import { navigation, pageHref, pagePaths, type NavGroup, type NavItem } from './nav';

export const siteName = 'Blnk';
export const ogImagePath = '/og.png';
export const ogImageAlt = 'Blnk documentation';
export const ogImageWidth = 602;
export const ogImageHeight = 339;

const llmsIntro = 'Developer documentation for the Blnk ledger.';

export function requireSite(site: URL | undefined): URL {
	if (!site) throw new Error('Set site in astro.config.mjs');
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

export function documentTitle(seoTitle: string | undefined, title: string): string {
	return `${present(seoTitle) ?? title} — ${siteName}`;
}

export function metaDescription(meta: string | undefined, description: string): string {
	return present(meta) ?? description;
}

export function markdownPath(href: string): string {
	return href === '/' ? '/index.md' : `${href}.md`;
}

export function pageMarkdown(title: string, description: string, body: string | undefined): string {
	return [`# ${title}`, description.trim(), body?.trim() ?? ''].filter(Boolean).join('\n\n');
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
		markdown: pageMarkdown(entry.data.title, description, entry.body),
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
		if (typeof item === 'string') ids.push(item);
		else {
			if (item.page) ids.push(item.page);
			ids.push(...pageIds(item.pages));
		}
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
	for (const tab of navigation.navigation.tabs) writeSection(tab.tab, tab.groups);

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
