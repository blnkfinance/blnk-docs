import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

const files = import.meta.glob<AstroComponentFactory>('../../content/snippets/*.mdx', {
	eager: true,
	import: 'default',
});

function sourcePath(filePath: string): string {
	const at = filePath.lastIndexOf('content/snippets/');
	return at === -1 ? filePath : `src/${filePath.slice(at)}`;
}

/** `api-key.mdx` becomes the `ApiKey` tag. */
function tagName(filePath: string): string {
	const file = filePath.slice(filePath.lastIndexOf('/') + 1, -'.mdx'.length);
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(file)) {
		throw new Error(
			`${sourcePath(filePath)} must be lowercase words separated by hyphens, such as api-key.mdx`,
		);
	}
	return file
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

const paths = new Map<string, string>();

export const snippets: Record<string, AstroComponentFactory> = {};

for (const [filePath, component] of Object.entries(files)) {
	const name = tagName(filePath);
	paths.set(name, sourcePath(filePath));
	snippets[name] = component;
}

export function withSnippets<T extends object>(components: T) {
	const builtins = components as Record<string, AstroComponentFactory>;
	for (const name of Object.keys(snippets)) {
		if (Object.hasOwn(builtins, name)) {
			throw new Error(`${paths.get(name)} registers <${name} />, which is already a component`);
		}
	}
	return { ...builtins, ...snippets };
}
