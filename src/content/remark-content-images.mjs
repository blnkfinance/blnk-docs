import { existsSync } from 'node:fs';
import path from 'node:path';

const contentRoot = path.resolve('src/content');

/**
 * `images/file.png` is resolved from `src/content`, from any page.
 * Paths that already start with `.`, `/`, or a scheme are left alone.
 * @param {string} url
 * @param {string} fromDir
 */
export function contentImageUrl(url, fromDir) {
	if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/|\.|#)/i.test(url)) return url;
	const target = path.resolve(contentRoot, url);
	const relativeToRoot = path.relative(contentRoot, target);
	if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return url;
	if (!existsSync(target)) return url;
	let rel = path.relative(fromDir, target);
	if (!rel.startsWith('.')) rel = `./${rel}`;
	return rel.split(path.sep).join('/');
}

/** @param {object} node */
function walk(node, visit) {
	if (!node || typeof node !== 'object') return;
	visit(node);
	if (Array.isArray(node.children)) {
		for (const child of node.children) walk(child, visit);
	}
}

export function remarkContentImages() {
	return (tree, file) => {
		const from = file.dirname || (file.path ? path.dirname(file.path) : '');
		if (!from) return;
		walk(tree, (node) => {
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
}
