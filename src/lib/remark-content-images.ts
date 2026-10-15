import { existsSync } from 'node:fs';
import path from 'node:path';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

const contentRoot = path.resolve('src/content');

type MdNode = {
	type?: string;
	url?: unknown;
	name?: string;
	children?: MdNode[];
	attributes?: MdAttr[];
};

type MdAttr = {
	type?: string;
	name?: string;
	value?: unknown;
};

type MdFile = {
	dirname?: string;
	path?: string;
};

/**
 * `images/file.png` is resolved from `src/content`, from any page.
 * Paths that already start with `.`, `/`, or a scheme are left alone.
 */
export function contentImageUrl(url: string, fromDir: string): string {
	if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/|\.|#)/i.test(url)) return url;
	const target = path.resolve(contentRoot, url);
	const relativeToRoot = path.relative(contentRoot, target);
	if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return url;
	if (!existsSync(target)) return url;
	let rel = path.relative(fromDir, target);
	if (!rel.startsWith('.')) rel = `./${rel}`;
	return rel.split(path.sep).join('/');
}

function walk(node: MdNode, visit: (node: MdNode) => void) {
	if (!node || typeof node !== 'object') return;
	visit(node);
	if (Array.isArray(node.children)) {
		for (const child of node.children) walk(child, visit);
	}
}

export const remarkContentImages: RemarkPlugin = function remarkContentImages() {
	return (tree, file) => {
		const mdFile = file as MdFile;
		const from = mdFile.dirname || (mdFile.path ? path.dirname(mdFile.path) : '');
		if (!from) return;
		walk(tree as MdNode, (node) => {
			if (node.type === 'image' && typeof node.url === 'string') {
				node.url = contentImageUrl(node.url, from);
			}
			const jsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
			if (!jsx || node.name !== 'img' || !Array.isArray(node.attributes)) return;
			for (const attr of node.attributes) {
				if (attr.type === 'mdxJsxAttribute' && attr.name === 'src' && typeof attr.value === 'string') {
					attr.value = contentImageUrl(attr.value, from);
				}
			}
		});
	};
};
