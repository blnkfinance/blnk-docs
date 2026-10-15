import { z } from 'astro/zod';
import docs from './docs.json' with { type: 'json' };

const pagePath = z
	.string()
	.regex(
		/^[a-z0-9]+(?:\/[a-z0-9]+)*$/,
		'Page paths are relative to src/content, without an extension',
	);

export type NavNode = string | NavGroup;

export type NavGroup = {
	group: string;
	pages: NavNode[];
};

export const navGroup: z.ZodType<NavGroup> = z.lazy(() =>
	z.strictObject({
		group: z.string().min(1),
		pages: z.array(z.union([pagePath, navGroup])),
	}),
);

export const navigationSchema = z.strictObject({
	navigation: z.strictObject({
		groups: z.array(navGroup),
	}),
});

export type Navigation = z.infer<typeof navigationSchema>;

export function pagePaths(navigation: Navigation): string[] {
	const paths: string[] = [];

	const walk = (pages: NavNode[]) => {
		for (const page of pages) {
			if (typeof page === 'string') {
				paths.push(page);
			} else {
				walk(page.pages);
			}
		}
	};

	for (const group of navigation.navigation.groups) {
		walk(group.pages);
	}

	return paths;
}

/** `index` is `/`. `docs/install` is `/docs/install`. `docs/index` is `/docs`. */
export function pageHref(id: string): string {
	const path = id.endsWith('/index') || id === 'index' ? id.slice(0, -'index'.length).replace(/\/$/, '') : id;
	return path === '' ? '/' : `/${path}`;
}

export function assertPagesExist(navigation: Navigation, ids: ReadonlySet<string>): void {
	const missing = pagePaths(navigation).filter((path) => !ids.has(path));
	if (missing.length > 0) {
		throw new Error(`docs.json references missing pages: ${missing.join(', ')}`);
	}
}

export const navigation = navigationSchema.parse(docs);
