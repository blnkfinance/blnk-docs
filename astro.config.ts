import { access, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { defineConfig, fontProviders } from 'astro/config';
import type { AstroIntegration } from 'astro';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { fenceMetaTransformer } from './src/lib/fence-meta';
import { tokenClassTransformer } from './src/lib/token-class';
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

const cacheControl = 'public, max-age=1800';

type HeaderEntry = {
	pathname: string;
	headers: { key: string; value: string }[];
};

function pagePath(name: string): string {
	if (name === '' || name === '/') return '/';
	return name.startsWith('/') ? name : `/${name}`;
}

async function addMarkdown(root: string, dir: string, paths: Set<string>) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name === '_astro' || entry.name === 'pagefind') continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			await addMarkdown(root, full, paths);
			continue;
		}
		if (!entry.name.endsWith('.md')) continue;
		const rel = relative(root, full).split(sep).join('/');
		paths.add(rel.startsWith('/') ? rel : `/${rel}`);
	}
}

/** Tell browsers and the host to keep each built page for 30 minutes. */
function pageCache(): AstroIntegration {
	return {
		name: 'page-cache',
		hooks: {
			'astro:build:done': async ({ dir, pages }) => {
				const client = fileURLToPath(dir);
				const file = join(client, '..', '_headers.json');
				const paths = new Set(pages.map((page) => pagePath(page.pathname)));
				await addMarkdown(client, client, paths);
				let existing: HeaderEntry[] = [];
				try {
					existing = JSON.parse(await readFile(file, 'utf8')) as HeaderEntry[];
				} catch {
					existing = [];
				}
				const byPath = new Map(existing.map((entry) => [entry.pathname, entry]));
				for (const pathname of paths) {
					const entry = byPath.get(pathname) ?? { pathname, headers: [] };
					entry.headers = entry.headers.filter((header) => header.key.toLowerCase() !== 'cache-control');
					entry.headers.push({ key: 'Cache-Control', value: cacheControl });
					byPath.set(pathname, entry);
				}
				await writeFile(file, JSON.stringify([...byPath.values()]));
			},
		},
	};
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
	adapter: node({ mode: 'standalone', staticHeaders: true }),
	prefetch: false,
	redirects: docs.redirects,
	integrations: [mdx(), pagefind(), pageCache()],
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
			transformers: [fenceMetaTransformer(), tokenClassTransformer()],
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
