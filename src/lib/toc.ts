import type { MarkdownHeading } from 'astro';

export type TocItem = {
	text: string;
	slug: string;
	tab: boolean;
	children: TocItem[];
};

function slugify(value: string): string {
	const slug = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
	return slug || 'section';
}

/** Headings from the page, with each tab title nested under the heading it follows. */
export function tocItems(headings: MarkdownHeading[], markdown: string): TocItem[] {
	const sections = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
	const used = new Set(sections.map((heading) => heading.slug));

	function tabSlug(title: string): string {
		const base = slugify(title);
		if (!used.has(base)) {
			used.add(base);
			return base;
		}
		let n = 2;
		while (used.has(`${base}-${n}`)) n += 1;
		const slug = `${base}-${n}`;
		used.add(slug);
		return slug;
	}

	type HeadingEvent = { kind: 'heading'; heading: MarkdownHeading };
	type TabEvent = { kind: 'tab'; text: string; slug: string };
	const events: Array<HeadingEvent | TabEvent> = [];
	let fence = false;
	let headingIndex = 0;

	for (const line of markdown.split('\n')) {
		if (line.startsWith('```')) {
			fence = !fence;
			continue;
		}
		if (fence) continue;

		const heading = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
		if (heading) {
			const depth = heading[1].length;
			const next = sections[headingIndex];
			if (next && next.depth === depth) {
				events.push({ kind: 'heading', heading: next });
				headingIndex += 1;
			}
			continue;
		}

		const tab = /<Tab\b[^>]*\btitle="([^"]*)"/.exec(line);
		if (tab) events.push({ kind: 'tab', text: tab[1], slug: tabSlug(tab[1]) });
	}

	const roots: TocItem[] = [];
	let h2: TocItem | null = null;
	let h3: TocItem | null = null;

	for (const event of events) {
		if (event.kind === 'heading' && event.heading.depth === 2) {
			h2 = { text: event.heading.text, slug: event.heading.slug, tab: false, children: [] };
			h3 = null;
			roots.push(h2);
			continue;
		}
		if (event.kind === 'heading' && event.heading.depth === 3) {
			h3 = { text: event.heading.text, slug: event.heading.slug, tab: false, children: [] };
			if (h2) h2.children.push(h3);
			else roots.push(h3);
			continue;
		}
		if (event.kind !== 'tab') continue;
		const item: TocItem = { text: event.text, slug: event.slug, tab: true, children: [] };
		if (h3) h3.children.push(item);
		else if (h2) h2.children.push(item);
	}

	return roots;
}
