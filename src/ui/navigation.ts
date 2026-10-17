import { z } from 'astro/zod';
import docs from '../content/docs.json' with { type: 'json' };

const pagePath = z
	.string()
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
		'Page paths are relative to src/content, without an extension',
	);

/** A page path, a page with an icon, or a dropdown whose pages can themselves be dropdowns. */
export type NavItem = string | NavPage | NavDropdown;

export type NavPage = {
	page: string;
	icon?: string;
};

export type NavDropdown = {
	dropdown: string;
	/** Content path when the label is also a page. */
	page?: string;
	icon?: string;
	pages: NavItem[];
};

export function isDropdown(item: NavItem): item is NavDropdown {
	return typeof item !== 'string' && 'dropdown' in item;
}

/** Sidebar and endpoint label. DELETE is shortened so the column stays tight. */
export function methodLabel(method: string): string {
	return method === 'DELETE' ? 'DEL' : method;
}

/** Content path for a link or for a dropdown that is also a page. */
export function itemPath(item: NavItem): string | undefined {
	if (typeof item === 'string') return item;
	return item.page;
}

export type NavGroup = {
	group: string;
	pages: NavItem[];
};

export type NavMenuItem = {
	label: string;
	path: string;
	groups: NavGroup[];
};

type NavLinkTab = {
	tab: string;
	path: string;
	groups: NavGroup[];
};

type NavMenuTab = {
	tab: string;
	path: string;
	menu: NavMenuItem[];
};

export type NavTab = NavLinkTab | NavMenuTab;

export type NavRoot = {
	path: '/';
	groups: NavGroup[];
};

const iconName = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Icon names are MingCute line filenames');

const navPage = z.strictObject({
	page: pagePath,
	icon: iconName.optional(),
});

export const navDropdown: z.ZodType<NavDropdown> = z.lazy(() =>
	z.strictObject({
		dropdown: z.string().min(1),
		page: pagePath.optional(),
		icon: iconName.optional(),
		pages: z.array(z.union([pagePath, navPage, navDropdown])),
	}),
);

const navGroup = z.strictObject({
	group: z.string().min(1),
	pages: z.array(z.union([pagePath, navPage, navDropdown])),
});

const tabPath = z
	.string()
	.regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/, 'Tab paths are site paths, such as / or /reference');

const navMenuItem = z.strictObject({
	label: z.string().min(1),
	path: tabPath,
	groups: z.array(navGroup),
});

/** A tab lists groups directly, or a menu whose items each list groups. */
const navTab = z.union([
	z.strictObject({
		tab: z.string().min(1),
		path: tabPath,
		groups: z.array(navGroup),
	}),
	z.strictObject({
		tab: z.string().min(1),
		path: tabPath,
		menu: z.array(navMenuItem).min(1),
	}),
]);

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
	pageBackground: oklch,
	bodyText: oklch,
	secondaryText: oklch,
	brandAccent: oklch,
	layoutDivider: oklch,
	contentBorder: oklch,
	surfaceFill: oklch,
});

const docsSchema = z.strictObject({
	labels: z.strictObject({
		enterprise: z.string().min(1),
	}),
	colors: z.strictObject({
		light: palette,
		dark: palette,
	}),
	navigation: navigationObject,
});

export type DocsColors = z.infer<typeof docsSchema>['colors'];
export type DocsLabels = z.infer<typeof docsSchema>['labels'];

function walk(pages: NavItem[], paths: string[]) {
	for (const page of pages) {
		const id = itemPath(page);
		if (id) paths.push(id);
		if (isDropdown(page)) walk(page.pages, paths);
	}
}

function isMenuTab(section: NavTab | NavRoot): section is NavMenuTab {
	return 'menu' in section;
}

/** Every group a tab owns, including groups nested under a menu. */
export function tabGroups(tab: NavTab): NavGroup[] {
	return isMenuTab(tab) ? tab.menu.flatMap((item) => item.groups) : tab.groups;
}

function menuMatches(item: NavMenuItem, path: string): boolean {
	if (item.path === '/') return path === '/';
	if (path === item.path || path.startsWith(`${item.path}/`)) return true;
	return item.groups.some((group) => listHasPath(group.pages, path));
}

/** The menu item that owns this URL. Longer paths win. */
export function activeMenu(tab: NavMenuTab, pathname: string): NavMenuItem | undefined {
	const path = normalizePath(pathname);
	return tab.menu.filter((item) => menuMatches(item, path)).sort((a, b) => b.path.length - a.path.length)[0];
}

function sectionGroups(section: NavTab | NavRoot, pathname: string): NavGroup[] {
	if (isMenuTab(section)) return activeMenu(section, pathname)?.groups ?? section.menu[0].groups;
	return section.groups;
}

/** Groups for the sidebar. A menu tab shows only the open item. */
export function sidebarGroups(navigation: Navigation, pathname: string): NavGroup[] {
	return sectionGroups(activeTab(navigation, pathname), pathname);
}

export function pagePaths(navigation: Navigation): string[] {
	const paths: string[] = [];
	const sections = [navigation.navigation.root, ...navigation.navigation.tabs];
	for (const section of sections) {
		const groups = isMenuTab(section) ? tabGroups(section) : section.groups;
		for (const group of groups) walk(group.pages, paths);
	}
	return paths;
}

function firstPageId(pages: NavItem[]): string | undefined {
	for (const page of pages) {
		const id = itemPath(page);
		if (id) return id;
		if (isDropdown(page)) {
			const nested = firstPageId(page.pages);
			if (nested) return nested;
		}
	}
}

/** First linked page in these groups, in nav order. */
export function firstPageHref(groups: NavGroup[]): string | undefined {
	for (const group of groups) {
		const id = firstPageId(group.pages);
		if (id) return pageHref(id);
	}
}

/**
 * The path when a page lives there. Otherwise the first page in the list.
 * The path stays when the list is empty too.
 */
export function linkHref(path: string, groups: NavGroup[], hrefs: ReadonlySet<string>): string {
	const target = normalizePath(path);
	if (hrefs.has(target)) return target;
	return firstPageHref(groups) ?? target;
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
		const id = itemPath(page);
		if (id && pageHref(id) === pathname) return true;
		if (isDropdown(page) && listHasPath(page.pages, pathname)) return true;
	}
	return false;
}

function normalizePath(pathname: string): string {
	return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function tabMatches(tab: NavTab | NavRoot, pathname: string): boolean {
	const path = normalizePath(pathname);
	if (tab.path === '/') {
		if (path === '/') return true;
	} else if (path === tab.path || path.startsWith(`${tab.path}/`)) {
		return true;
	}
	if (isMenuTab(tab)) return tab.menu.some((item) => menuMatches(item, path));
	return tab.groups.some((group) => listHasPath(group.pages, path));
}

/** The tab that owns this URL, if one does. Longer paths win. */
export function currentTab(navigation: Navigation, pathname: string): NavTab | NavRoot | undefined {
	const sections = [navigation.navigation.root, ...navigation.navigation.tabs];
	return sections
		.filter((tab) => tabMatches(tab, pathname))
		.sort((a, b) => b.path.length - a.path.length || Number('tab' in b) - Number('tab' in a))[0];
}

export function activeTab(navigation: Navigation, pathname: string): NavTab | NavRoot {
	return currentTab(navigation, pathname) ?? navigation.navigation.root;
}

function groupFor(section: NavTab | NavRoot, pathname: string): string | undefined {
	return sectionGroups(section, pathname).find((group) => listHasPath(group.pages, pathname))?.group;
}

function dropdownAncestors(section: NavTab | NavRoot, pathname: string): NavDropdown[] {
	const found: NavDropdown[] = [];

	function walk(pages: NavItem[], stack: NavDropdown[]): boolean {
		for (const page of pages) {
			const id = itemPath(page);
			if (id && pageHref(id) === pathname) {
				found.push(...stack);
				return true;
			}
			if (isDropdown(page) && walk(page.pages, [...stack, page])) return true;
		}
		return false;
	}

	for (const group of sectionGroups(section, pathname)) {
		if (walk(group.pages, [])) return found;
	}
	return found;
}

export type Crumb = {
	name: string;
	href?: string;
};

/** Group name above the title. Home and pages outside the nav have none. */
export function pageLabel(navigation: Navigation, pathname: string): string | undefined {
	const path = normalizePath(pathname);
	if (path === '/') return undefined;
	return groupFor(activeTab(navigation, path), path);
}

/** Trail for structured data. `/` has none. The last crumb is the current page. */
function sectionHref(section: NavTab, pathname: string, hrefs: ReadonlySet<string>): string {
	if (isMenuTab(section)) {
		const item = activeMenu(section, pathname) ?? section.menu[0];
		return linkHref(item.path, item.groups, hrefs);
	}
	return linkHref(section.path, section.groups, hrefs);
}

export function breadcrumbs(
	navigation: Navigation,
	pathname: string,
	title: string,
	hrefs: ReadonlySet<string> = new Set(),
): Crumb[] {
	const path = normalizePath(pathname);
	if (path === '/') return [];

	const section = activeTab(navigation, path);
	const crumbs: Crumb[] = [{ name: 'Home', href: '/' }];
	if (path === section.path) {
		crumbs.push({ name: title });
		return crumbs;
	}

	if ('tab' in section) crumbs.push({ name: section.tab, href: sectionHref(section, path, hrefs) });
	const groups = sectionGroups(section, path);
	if (groups.length > 1) {
		const group = groupFor(section, path);
		if (group) crumbs.push({ name: group });
	}
	for (const dropdown of dropdownAncestors(section, path)) {
		crumbs.push(
			dropdown.page
				? { name: dropdown.dropdown, href: pageHref(dropdown.page) }
				: { name: dropdown.dropdown },
		);
	}
	crumbs.push({ name: title });
	return crumbs;
}

export function assertPagesExist(navigation: Navigation, ids: ReadonlySet<string>): void {
	const missing = pagePaths(navigation).filter((path) => !ids.has(path));
	const problems = [missing.length > 0 ? `missing pages: ${missing.join(', ')}` : ''].filter(Boolean);
	if (problems.length > 0) {
		throw new Error(`docs.json references ${problems.join('; ')}`);
	}
}

const parsed = docsSchema.parse(docs);

export const labels: DocsLabels = parsed.labels;
export const colors: DocsColors = parsed.colors;
export const navigation: Navigation = { navigation: parsed.navigation };
