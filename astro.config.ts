import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { defineConfig, fontProviders } from 'astro/config';
import type { AstroIntegration } from 'astro';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { fenceMetaTransformer } from './src/lib/fence-meta';
import { remarkContentImages } from './src/lib/remark-content-images';

const root = fileURLToPath(new URL('.', import.meta.url));

function run(command: string, args: string[]) {
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, args, { stdio: 'inherit' });
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${command} exited with ${code}`));
		});
	});
}

/** Index the built site, then copy the bundle so the dev server can serve it. */
function pagefind(): AstroIntegration {
	return {
		name: 'pagefind',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				const site = fileURLToPath(dir);
				await run(join(root, 'node_modules', '.bin', 'pagefind'), ['--site', site]);
				const output = join(root, 'public', 'pagefind');
				await rm(output, { recursive: true, force: true });
				await mkdir(join(root, 'public'), { recursive: true });
				await cp(join(site, 'pagefind'), output, { recursive: true });
			},
		},
	};
}

const regular = './src/assets/fonts/Graphik-Regular.woff2';
const italic = './src/assets/fonts/Graphik-RegularItalic.woff2';
const medium = './src/assets/fonts/Graphik-Medium.woff2';
const geistRegular = './src/assets/fonts/GeistMono-Regular.woff2';
const geistMedium = './src/assets/fonts/GeistMono-Medium.woff2';

function face(weight: number, style: 'normal' | 'italic', file: string) {
	return {
		weight,
		style,
		src: [file] as [string],
		display: 'swap' as const,
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.blnkfinance.com',
	trailingSlash: 'never',
	redirects: {
		'/metadata/overview': '/metadata',
		'/metadata/create-metadata': '/metadata',
		'/metadata/update-metadata': '/metadata',
		'/reference/proxy-api': '/reference/enterprise#proxy',
		'/reference/api-keys': '/reference/enterprise-api-key',
		'/changelog/upgrade': '/migrations/core/upgrade',
		'/changelog/v15-4-migration': '/migrations/core/v15-4-migration',
		'/changelog/v15-1-migration': '/migrations/core/v15-1-migration',
		'/changelog/v15-migration': '/migrations/core/v15-migration',
		'/changelog/v14-3-migration': '/migrations/core/v14-3-migration',
		'/changelog/v14-migration': '/migrations/core/v14-migration',
		'/changelog/v13-2-migration': '/migrations/core/v13-2-migration',
		'/changelog/v12-migration': '/migrations/core/v12-migration',
		'/changelog/v11-migration': '/migrations/core/v11-migration',
		'/changelog/v10-5-migration': '/migrations/core/v10-5-migration',
		'/cloud/instances/migration': '/migrations/migrate-to-cloud',
	},
	integrations: [mdx(), pagefind()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkContentImages],
		}),
		shikiConfig: {
			langAlias: {
				text: 'plaintext',
			},
			themes: {
				light: 'one-light',
				dark: 'one-dark-pro',
			},
			defaultColor: false,
			transformers: [fenceMetaTransformer()],
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Graphik',
			cssVariable: '--font-graphik',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					face(400, 'normal', regular),
					face(400, 'italic', italic),
					face(500, 'normal', medium),
					face(600, 'normal', medium),
					face(700, 'normal', medium),
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Geist Mono',
			cssVariable: '--font-geist-mono',
			fallbacks: ['monospace'],
			options: {
				variants: [
					face(400, 'normal', geistRegular),
					face(500, 'normal', geistMedium),
					face(600, 'normal', geistMedium),
					face(700, 'normal', geistMedium),
				],
			},
		},
	],
});
