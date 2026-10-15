import { z } from 'astro/zod';
import docs from './docs.json' with { type: 'json' };

const pagePath = z
	.string()
	.regex(
		/^[a-z0-9]+(?:\/[a-z0-9]+)*$/,
		'Page paths are relative to src/content, without an extension',
	);

/** A page path, or a dropdown whose pages can themselves be dropdowns. */
export type NavItem = string | NavDropdown;

export type NavDropdown = {
	dropdown: string;
	/** Content path when the label is also a page. */
	page?: string;
	pages: NavItem[];
};

export type NavGroup = {
	group: string;
	pages: NavItem[];
};

export type NavTab = {
	tab: string;
	path: string;
	groups: NavGroup[];
};

export type NavRoot = {
	path: '/';
	groups: NavGroup[];
};

export const navDropdown: z.ZodType<NavDropdown> = z.lazy(() =>
	z.strictObject({
		dropdown: z.string().min(1),
		page: pagePath.optional(),
		pages: z.array(z.union([pagePath, navDropdown])),
	}),
);

const navGroup = z.strictObject({
	group: z.string().min(1),
	pages: z.array(z.union([pagePath, navDropdown])),
});

const tabPath = z
	.string()
	.regex(/^\/[a-z0-9]+(?:\/[a-z0-9]+)*$/, 'Tab paths are site paths, such as /core');

const navTab = z.strictObject({
	tab: z.string().min(1),
	path: tabPath,
	groups: z.array(navGroup),
});

const navRoot = z.strictObject({
	path: z.literal('/'),
	groups: z.array(navGroup),
});

const navigationObject = z.strictObject({
	root: navRoot,
	tabs: z.array(navTab).min(1),
});

export const navigationSchema = z.strictObject({
	navigation: navigationObject,
});

export type Navigation = z.infer<typeof navigationSchema>;

const oklch = z.string().regex(/^oklch\(\s*(?:0|1|0?\.\d{1,3})\s+(?:0|0?\.\d{1,3})\s+(?:0|[1-9]\d{0,2}(?:\.\d{1,3})?)\s*\)$/);

const palette = z.strictObject({
	primary: oklch,
	text: oklch,
	muted: oklch,
	background: oklch,
	divider: oklch,
	line: oklch,
	fill: oklch,
});

const docsSchema = z.strictObject({
	colors: z.strictObject({
		light: palette,
		dark: palette,
	}),
	navigation: navigationObject,
});

export type DocsColors = z.infer<typeof docsSchema>['colors'];

function walk(pages: NavItem[], paths: string[]) {
	for (const page of pages) {
		if (typeof page === 'string') paths.push(page);
		else {
			if (page.page) paths.push(page.page);
			walk(page.pages, paths);
		}
	}
}

export function pagePaths(navigation: Navigation): string[] {
	const paths: string[] = [];
	const sections = [navigation.navigation.root, ...navigation.navigation.tabs];
	for (const section of sections) {
		for (const group of section.groups) walk(group.pages, paths);
	}
	return paths;
}

/** `index` is `/`. `docs/install` is `/docs/install`. `docs/index` is `/docs`. */
export function pageHref(id: string): string {
	const path = id.endsWith('/index') || id === 'index' ? id.slice(0, -'index'.length).replace(/\/$/, '') : id;
	return path === '' ? '/' : `/${path}`;
}

export function matchesPage(id: string, pathname: string): boolean {
	return pageHref(id) === normalizePath(pathname);
}

function listHasPath(pages: NavItem[], pathname: string): boolean {
	for (const page of pages) {
		if (typeof page === 'string') {
			if (pageHref(page) === pathname) return true;
		} else if ((page.page && pageHref(page.page) === pathname) || listHasPath(page.pages, pathname)) {
			return true;
		}
	}
	return false;
}

function normalizePath(pathname: string): string {
	return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function tabMatches(tab: { path: string; groups: NavGroup[] }, pathname: string): boolean {
	const path = normalizePath(pathname);
	if (tab.path === '/') {
		if (path === '/') return true;
	} else if (path === tab.path || path.startsWith(`${tab.path}/`)) {
		return true;
	}
	return tab.groups.some((group) => listHasPath(group.pages, path));
}

/** The tab that owns this URL, if one does. Longer paths win. */
export function currentTab(navigation: Navigation, pathname: string): NavTab | NavRoot | undefined {
	const sections = [navigation.navigation.root, ...navigation.navigation.tabs];
	return sections.filter((tab) => tabMatches(tab, pathname)).sort((a, b) => b.path.length - a.path.length)[0];
}

export function activeTab(navigation: Navigation, pathname: string): NavTab | NavRoot {
	return currentTab(navigation, pathname) ?? navigation.navigation.root;
}

function groupFor(section: NavTab | NavRoot, pathname: string): string | undefined {
	return section.groups.find((group) => listHasPath(group.pages, pathname))?.group;
}

/** Group name for a page. The section itself uses its tab, and `/` is Home. */
export function pageLabel(navigation: Navigation, pathname: string): string {
	const path = normalizePath(pathname);
	const section = activeTab(navigation, path);
	const tabName = 'tab' in section ? section.tab : 'Home';
	if (path === section.path) return tabName;
	return groupFor(section, path) ?? tabName;
}

export function assertPagesExist(navigation: Navigation, ids: ReadonlySet<string>): void {
	const hrefs = new Set([...ids].map((id) => pageHref(id)));
	const missing = pagePaths(navigation).filter((path) => !ids.has(path));
	const tabPaths = [navigation.navigation.root.path, ...navigation.navigation.tabs.map((tab) => tab.path)];
	const missingTabs = tabPaths.filter((path) => !hrefs.has(path));
	const problems = [
		missing.length > 0 ? `missing pages: ${missing.join(', ')}` : '',
		missingTabs.length > 0 ? `tab paths with no page: ${missingTabs.join(', ')}` : '',
	].filter(Boolean);
	if (problems.length > 0) {
		throw new Error(`docs.json references ${problems.join('; ')}`);
	}
}

const parsed = docsSchema.parse(docs);

export const colors: DocsColors = parsed.colors;
export const navigation: Navigation = { navigation: parsed.navigation };
