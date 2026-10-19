import type { Element, ElementContent, Properties, Text } from 'hast';
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
		code(node) {
			highlightIds(node);
		},
	};
}

const slotPattern = /\{\{([A-Za-z_][A-Za-z0-9_]*)\}\}/g;
const idPattern = /\{[A-Za-z_][A-Za-z0-9_]*\}/g;

function slotText(name: string, raw: string): string {
	if (name === 'CORE_URL' || name === 'CORE_SECRET_KEY') return name;
	return raw;
}

/** `{ledger_id}` marks an id. `{{name}}` is a tutorial value the page fills in. */
function highlightIds(node: Element) {
	groupSplitSlots(node);
	const next: ElementContent[] = [];
	for (const child of node.children) {
		if (child.type === 'element') {
			if (child.properties?.['data-fill'] == null) highlightIds(child);
			next.push(child);
			continue;
		}
		if (child.type !== 'text') {
			next.push(child);
			continue;
		}
		next.push(...splitTutorialText(child));
	}
	node.children = next;
}

function textOf(node: ElementContent): string {
	if (node.type === 'text') return node.value;
	if (node.type === 'element') return node.children.map(textOf).join('');
	return '';
}

/** Shiki can split `{{name}}` across spans. Join that run into one fill. */
function groupSplitSlots(node: Element) {
	const children = node.children;
	if (children.length < 2) return;
	const texts = children.map(textOf);
	const full = texts.join('');
	if (!full.includes('{{')) return;
	const starts: number[] = [];
	let offset = 0;
	for (const text of texts) {
		starts.push(offset);
		offset += text.length;
	}
	const taken = new Set<number>();
	const grouped = new Map<number, Element>();
	for (const match of full.matchAll(slotPattern)) {
		const start = match.index ?? 0;
		const end = start + match[0].length;
		const first = starts.findIndex((item, index) => item <= start && start < item + texts[index].length);
		if (first < 0 || start !== starts[first]) continue;
		let last = first;
		while (last + 1 < texts.length && starts[last] + texts[last].length < end) last += 1;
		if (last === first || starts[last] + texts[last].length !== end) continue;
		for (let index = first; index <= last; index += 1) taken.add(index);
		grouped.set(first, {
			type: 'element',
			tagName: 'span',
			properties: { className: ['code-id'], 'data-fill': match[1] },
			children: [{ type: 'text', value: slotText(match[1], match[0]) }],
		});
	}
	if (grouped.size === 0) return;
	const next: ElementContent[] = [];
	for (let index = 0; index < children.length; index += 1) {
		const group = grouped.get(index);
		if (group) next.push(group);
		else if (!taken.has(index)) next.push(children[index]);
	}
	node.children = next;
}

function splitTutorialText(node: Text): ElementContent[] {
	if (!node.value.includes('{')) return [node];
	const parts: ElementContent[] = [];
	for (const part of splitSlots(node)) {
		if (part.type === 'text' && idPattern.test(part.value)) {
			idPattern.lastIndex = 0;
			parts.push(...splitIds(part));
		} else {
			idPattern.lastIndex = 0;
			parts.push(part);
		}
	}
	return parts;
}

function splitSlots(node: Text): ElementContent[] {
	const parts: ElementContent[] = [];
	let last = 0;
	for (const match of node.value.matchAll(slotPattern)) {
		const index = match.index ?? 0;
		if (index > last) parts.push({ type: 'text', value: node.value.slice(last, index) });
		parts.push({
			type: 'element',
			tagName: 'span',
			properties: { className: ['code-id'], 'data-fill': match[1] },
			children: [{ type: 'text', value: slotText(match[1], match[0]) }],
		});
		last = index + match[0].length;
	}
	if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
	if (parts.length === 0) return [node];
	return parts;
}

function splitIds(node: Text): ElementContent[] {
	const parts: ElementContent[] = [];
	let last = 0;
	for (const match of node.value.matchAll(idPattern)) {
		const index = match.index ?? 0;
		if (index > last) parts.push({ type: 'text', value: node.value.slice(last, index) });
		parts.push({
			type: 'element',
			tagName: 'span',
			properties: { className: ['code-id'] },
			children: [{ type: 'text', value: match[0] }],
		});
		last = index + match[0].length;
	}
	if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
	return parts;
}
