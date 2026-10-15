/**
 * Mintlify fence info after the language: `cURL wrap expandable`, `200 OK wrap`,
 * `200 Success icon="circle-check"`.
 * @param {string} meta
 */
export function parseFenceMeta(meta) {
	const tokens = meta.match(/icon="[^"]*"|[^\s]+/g) ?? [];
	let wrap = false;
	let expandable = false;
	/** @type {string | undefined} */
	let icon;
	const title = [];
	for (const token of tokens) {
		if (token === 'wrap') wrap = true;
		else if (token === 'expandable') expandable = true;
		else if (token.startsWith('icon="') && token.endsWith('"')) icon = token.slice(6, -1);
		else title.push(token);
	}
	return { title: title.join(' '), wrap, expandable, icon };
}

/** Shiki transformer. The first fence word stays the language. */
export function fenceMetaTransformer() {
	return {
		name: 'mintlify-fence-meta',
		pre(node) {
			const meta = this.options.meta;
			const raw = typeof meta === 'string' ? meta : (meta?.__raw ?? '');
			const parsed = parseFenceMeta(raw);
			const properties = node.properties ?? {};
			if (parsed.title) properties['data-title'] = parsed.title;
			else if (this.options.lang) properties['data-language'] = this.options.lang;
			if (parsed.wrap) properties['data-wrap'] = '';
			if (parsed.expandable) properties['data-expandable'] = '';
			if (parsed.icon) properties['data-icon'] = parsed.icon;
			node.properties = properties;
		},
	};
}
