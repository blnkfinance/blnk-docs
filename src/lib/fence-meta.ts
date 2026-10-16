import type { Element, Properties } from 'hast';
import type { ShikiTransformer } from 'shiki';

type FenceMeta = {
	title: string;
	wrap: boolean;
	expandable: boolean;
	icon?: string;
	highlight: Set<number>;
	focus: Set<number>;
};

/**
 * Fence info after the language.
 * `cURL wrap`, `200 OK wrap expandable highlight={2} focus={2,4-5}`,
 * `200 Success icon="check-circle"`.
 */
export function parseFenceMeta(meta: string): FenceMeta {
	const tokens = meta.match(/icon="[^"]*"|[^\s]+/g) ?? [];
	let wrap = false;
	let expandable = false;
	let icon: string | undefined;
	const highlight = new Set<number>();
	const focus = new Set<number>();
	const title = [];
	for (const token of tokens) {
		if (token === 'wrap') wrap = true;
		else if (token === 'expandable') expandable = true;
		else if (token.startsWith('icon="') && token.endsWith('"')) icon = token.slice(6, -1);
		else if (token.startsWith('highlight=')) addLines(highlight, token.slice('highlight='.length));
		else if (token.startsWith('focus=')) addLines(focus, token.slice('focus='.length));
		else if (/^\{[\d,\-]+\}$/.test(token)) addLines(highlight, token);
		else title.push(token);
	}
	return { title: title.join(' '), wrap, expandable, icon, highlight, focus };
}

/** `2`, `{2,4-6}`, or `2,4-6`. */
function addLines(set: Set<number>, raw: string) {
	const value = raw.replace(/^\{|\}$/g, '');
	for (const part of value.split(',')) {
		const piece = part.trim();
		if (!piece) continue;
		const [from, to] = piece.split('-').map((item) => Number(item));
		if (!from) continue;
		const end = to || from;
		for (let line = from; line <= end; line += 1) set.add(line);
	}
}

function metaOf(context: { options: { meta?: string | { __raw?: string } } }) {
	const meta = context.options.meta;
	const raw = typeof meta === 'string' ? meta : (meta?.__raw ?? '');
	return parseFenceMeta(raw);
}

function props(node: Element): Properties {
	return (node.properties ??= {});
}

/** Shiki transformer. The first fence word stays the language. */
export function fenceMetaTransformer(): ShikiTransformer {
	return {
		name: 'mintlify-fence-meta',
		pre(node) {
			const parsed = metaOf(this);
			const properties = props(node);
			if (parsed.title) properties['data-title'] = parsed.title;
			else if (this.options.lang) properties['data-language'] = this.options.lang;
			if (parsed.wrap) properties['data-wrap'] = '';
			if (parsed.expandable) properties['data-expandable'] = '';
			if (parsed.icon) properties['data-icon'] = parsed.icon;
			if (parsed.focus.size) properties['data-focus'] = '';
		},
		line(node, line) {
			const parsed = metaOf(this);
			const properties = props(node);
			if (parsed.highlight.has(line)) properties['data-highlight'] = '';
			if (parsed.focus.has(line)) properties['data-focus'] = '';
		},
	};
}
