import { getCollection } from 'astro:content';
import { enterpriseNotice, isDropdown, itemPath, navigation, pageHref, pagePaths, tabGroups, type NavItem } from '../ui/navigation';
import { metaDescription, pageMarkdown } from '../lib/seo';

export type EnterpriseFlag = 'license';

export type DocPage = {
	id: string;
	href: string;
	title: string;
	description: string;
	markdown: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	endpoint?: string;
	enterprise?: EnterpriseFlag;
	area: string;
	group: string;
};

function walk(pages: NavItem[], area: string, group: string, into: Map<string, { area: string; group: string }>) {
	for (const page of pages) {
		const id = itemPath(page);
		if (id && !into.has(id)) into.set(id, { area, group });
		if (isDropdown(page)) walk(page.pages, area, group, into);
	}
}

function placements(): Map<string, { area: string; group: string }> {
	const into = new Map<string, { area: string; group: string }>();
	for (const group of navigation.navigation.root.groups) walk(group.pages, 'Core', group.group, into);
	for (const tab of navigation.navigation.tabs) {
		for (const group of tabGroups(tab)) walk(group.pages, tab.tab, group.group, into);
	}
	return into;
}

let corpus: Promise<DocPage[]> | undefined;

export function loadCorpus(): Promise<DocPage[]> {
	corpus ??= readCorpus();
	return corpus;
}

async function readCorpus(): Promise<DocPage[]> {
	const place = placements();
	const entries = await getCollection('docs');
	const byId = new Map(
		entries.map((entry) => {
			const where = place.get(entry.id);
			const description = metaDescription(entry.data.metaDescription, entry.data.description);
			const enterprise = entry.data.enterprise === false ? undefined : entry.data.enterprise;
			const page: DocPage = {
				id: entry.id,
				href: pageHref(entry.id),
				title: entry.data.title,
				description,
				markdown: pageMarkdown(entry.data.title, description, entry.body, enterpriseNotice(entry.data.enterprise)),
				method: entry.data.method,
				endpoint: entry.data.path,
				enterprise,
				area: where?.area ?? '',
				group: where?.group ?? '',
			};
			return [entry.id, page] as const;
		}),
	);

	const ordered: DocPage[] = [];
	const seen = new Set<string>();
	for (const id of pagePaths(navigation)) {
		const page = byId.get(id);
		if (!page || seen.has(id)) continue;
		seen.add(id);
		ordered.push(page);
	}
	for (const entry of entries) {
		if (seen.has(entry.id)) continue;
		const page = byId.get(entry.id);
		if (!page) continue;
		seen.add(entry.id);
		ordered.push(page);
	}
	return ordered;
}
