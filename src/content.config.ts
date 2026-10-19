/** Page frontmatter for every file under src/content. */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

function contentId(entry: string): string {
	const id = entry.replace(/\\/g, '/').replace(/\.mdx$/, '');
	return id.endsWith('/index') ? id.slice(0, -'/index'.length) : id;
}

const docs = defineCollection({
	loader: glob({
		// A file in tutorials/ is a page. A nested file is a page only when it is index.mdx.
		pattern: ['**/*.mdx', '!snippets/**', '!tutorials/*/**/!(index).mdx'],
		base: './src/content',
		generateId: ({ entry }) => contentId(entry),
	}),
	schema: z
		.object({
			title: z.string(),
			sidebarTitle: z.string().optional(),
			description: z.string(),
			metaDescription: z.string().optional(),
			noindex: z.boolean().optional().default(false),
			tutorial: z.boolean().optional().default(false),
			enterprise: z.union([z.literal(false), z.literal('license')]).optional().default(false),
			icon: z
				.string()
				.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Icon names are MingCute line filenames')
				.optional(),
			method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
			path: z.string().regex(/^\//, 'Endpoint paths start with /').optional(),
		})
		.superRefine((data, ctx) => {
			if ((data.method == null) !== (data.path == null)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Set method and path together',
					path: [data.method == null ? 'method' : 'path'],
				});
			}
		}),
});

export const collections = { docs };

