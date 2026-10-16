import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
	loader: glob({
		pattern: '**/*.mdx',
		base: './src/content',
		generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.mdx$/, ''),
	}),
	schema: z
		.object({
			title: z.string(),
			description: z.string(),
			seoTitle: z.string().optional(),
			metaDescription: z.string().optional(),
			noindex: z.boolean().optional().default(false),
			method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional(),
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

