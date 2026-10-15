/**
 * Fence info after the language.
 * `cURL wrap`, `200 OK wrap expandable highlight={2} focus={2,4-5}`,
 * `200 Success icon="circle-check"`.
 * @param {string} meta
 */
export function parseFenceMeta(meta) {
	const tokens = meta.match(/icon="[^"]*"|[^\s]+/g) ?? [];
	let wrap = false;
	let expandable = false;
	/** @type {string | undefined} */
	let icon;
	/** @type {Set<number>} */
	const highlight = new Set();
	/** @type {Set<number>} */
	const focus = new Set();
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

/**
 * `2`, `{2,4-6}`, or `2,4-6`.
 * @param {Set<number>} set
 * @param {string} raw
 */
function addLines(set, raw) {
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

/**
 * @param {{ options: { meta?: string | { __raw?: string } } }} transformer
 */
function metaOf(transformer) {
	const meta = transformer.options.meta;
	const raw = typeof meta === 'string' ? meta : (meta?.__raw ?? '');
	return parseFenceMeta(raw);
}

/** Shiki transformer. The first fence word stays the language. */
export function fenceMetaTransformer() {
	return {
		name: 'mintlify-fence-meta',
		pre(node) {
			const parsed = metaOf(this);
			const properties = node.properties ?? {};
			if (parsed.title) properties['data-title'] = parsed.title;
			else if (this.options.lang) properties['data-language'] = this.options.lang;
			if (parsed.wrap) properties['data-wrap'] = '';
			if (parsed.expandable) properties['data-expandable'] = '';
			if (parsed.icon) properties['data-icon'] = parsed.icon;
			if (parsed.focus.size) properties['data-focus'] = '';
			node.properties = properties;
		},
		/**
		 * @param {import('hast').Element} node
		 * @param {number} line
		 */
		line(node, line) {
			const parsed = metaOf(this);
			const properties = node.properties ?? {};
			if (parsed.highlight.has(line)) properties['data-highlight'] = '';
			if (parsed.focus.has(line)) properties['data-focus'] = '';
			node.properties = properties;
		},
	};
}
