import { access, cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { defineConfig, fontProviders } from 'astro/config';
import type { AstroIntegration } from 'astro';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { fenceMetaTransformer } from './src/lib/fence-meta';
import { remarkContentImages } from './src/lib/remark-content-images';
import docs from './src/content/docs.json' with { type: 'json' };

const root = fileURLToPath(new URL('.', import.meta.url));

function run(command: string, args: string[], timeoutMs: number) {
	return new Promise<void>((resolve, reject) => {
		// Ignore stdin. An open pipe keeps the Pagefind wrapper from exiting after it prints "Finished".
		const child = spawn(command, args, {
			stdio: ['ignore', 'inherit', 'inherit'],
			detached: true,
		});
		const timer = setTimeout(() => {
			if (child.pid != null) {
				try {
					process.kill(-child.pid, 'SIGKILL');
				} catch {
					child.kill('SIGKILL');
				}
			}
		}, timeoutMs);
		child.on('error', (error) => {
			clearTimeout(timer);
			reject(error);
		});
		child.on('exit', (code, signal) => {
			clearTimeout(timer);
			if (code === 0 || signal === 'SIGKILL') resolve();
			else reject(new Error(`${command} exited with ${code ?? signal}`));
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
				const index = join(site, 'pagefind', 'pagefind.js');
				await run(join(root, 'node_modules', '.bin', 'pagefind'), ['--site', site], 60_000);
				await access(index);
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
	server: { host: true },
	adapter: node({ mode: 'standalone' }),
	redirects: docs.redirects,
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
