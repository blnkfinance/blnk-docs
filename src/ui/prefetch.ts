type Entry = {
	html: Promise<string>;
	done: boolean;
};

type PrepEvent = Event & {
	to: URL;
	formData?: FormData | null;
	signal: AbortSignal;
	loader: () => Promise<void>;
	newDocument: Document;
};

const cache = new Map<string, Entry>();
const recent: string[] = [];
const queue: string[] = [];
const kept = 6;
const hoverDelay = 50;
let active = 0;
let generation = 0;
let hoverTimer = 0;
let hoverKey = '';

function limit() {
	return import.meta.env.DEV ? 1 : 2;
}

function slowConnection() {
	const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
	if (!connection) return false;
	return connection.saveData === true || /2g/.test(connection.effectiveType ?? '');
}

function pageKey(href: string): string | undefined {
	let url: URL;
	try {
		url = new URL(href, location.href);
	} catch {
		return;
	}
	if (url.origin !== location.origin) return;
	url.hash = '';
	if (url.pathname === location.pathname && url.search === location.search) return;
	return `${url.pathname}${url.search}`;
}

function linkFrom(target: EventTarget | null): HTMLAnchorElement | undefined {
	if (!(target instanceof Element)) return;
	const link = target.closest('a[href]');
	if (!(link instanceof HTMLAnchorElement)) return;
	if (link.target === '_blank' || link.hasAttribute('download')) return;
	return link;
}

function remember(key: string) {
	if (import.meta.env.DEV) {
		cache.delete(key);
		return;
	}
	const index = recent.indexOf(key);
	if (index >= 0) recent.splice(index, 1);
	recent.push(key);
	while (recent.length > kept) {
		const oldest = recent.shift();
		if (oldest) cache.delete(oldest);
	}
}

function startPrefetch(href: string) {
	const key = pageKey(href);
	if (!key || cache.has(key)) return;
	const html = fetch(key, { credentials: 'same-origin' }).then(async (response) => {
		const type = response.headers.get('content-type') ?? '';
		if (!response.ok || response.redirected || !type.includes('text/html')) {
			throw new Error('prefetch');
		}
		return response.text();
	});
	const entry: Entry = { html, done: false };
	cache.set(key, entry);
	html.then(
		() => {
			entry.done = true;
			remember(key);
		},
		() => {
			cache.delete(key);
		},
	);
}

async function take(href: string): Promise<string | undefined> {
	const key = pageKey(href);
	if (!key) return;
	const entry = cache.get(key);
	if (!entry) return;
	if (import.meta.env.DEV && entry.done) {
		cache.delete(key);
		return;
	}
	try {
		const html = await entry.html;
		if (import.meta.env.DEV) cache.delete(key);
		return html;
	} catch {
		cache.delete(key);
	}
}

function pump() {
	const cap = limit();
	while (active < cap && queue.length > 0) {
		const href = queue.shift();
		if (!href) return;
		active += 1;
		const key = pageKey(href);
		const pending = key ? cache.get(key)?.html : undefined;
		startPrefetch(href);
		const done = pending ?? (key ? cache.get(key)?.html : undefined) ?? Promise.resolve('');
		void done.catch(() => undefined).finally(() => {
			active -= 1;
			pump();
		});
	}
}

function collect(): string[] {
	const seen = new Set<string>();
	const hrefs: string[] = [];
	function push(link: Element) {
		if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return;
		const key = pageKey(link.href);
		if (!key || seen.has(key)) return;
		seen.add(key);
		hrefs.push(key);
	}
	const sidebar = document.getElementById('docs-nav');
	if (sidebar?.dataset.navScope === 'Learn') {
		for (const group of sidebar.querySelectorAll('.nav-group')) {
			if (group.querySelector('.nav-label')?.textContent?.trim() !== 'Tutorials') continue;
			group.querySelectorAll('a.nav-item[href]').forEach(push);
		}
	}
	document.querySelectorAll('nav.related a[href]').forEach(push);
	const items = [...(sidebar?.querySelectorAll('a.nav-item[href]') ?? [])].filter((link) => {
		if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return false;
		return link.getAttribute('aria-current') === 'page' || pageKey(link.href) !== undefined;
	});
	const index = items.findIndex((link) => link.getAttribute('aria-current') === 'page');
	if (index >= 0) {
		for (let step = 1; step <= 3; step += 1) {
			const link = items[index + step];
			if (link) push(link);
		}
		for (let step = 1; step <= 2; step += 1) {
			const link = items[index - step];
			if (link) push(link);
		}
	}
	document.querySelectorAll('nav.tabs a[href]').forEach(push);
	return hrefs;
}

function scheduleIdle() {
	generation += 1;
	const gen = generation;
	queue.length = 0;
	window.clearTimeout(hoverTimer);
	hoverKey = '';
	const run = () => {
		if (gen !== generation || slowConnection()) return;
		for (const href of collect()) queue.push(href);
		pump();
	};
	if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
	else window.setTimeout(run, 200);
}

function prefetchLink(link: HTMLAnchorElement | undefined) {
	if (!link) return;
	const key = pageKey(link.href);
	if (key) startPrefetch(key);
}

function onPointer(event: Event) {
	prefetchLink(linkFrom(event.target));
}

function onFocus(event: Event) {
	if (slowConnection()) return;
	prefetchLink(linkFrom(event.target));
}

function onOver(event: MouseEvent) {
	if (slowConnection()) return;
	const link = linkFrom(event.target);
	const key = link ? pageKey(link.href) : undefined;
	if (!key) return;
	window.clearTimeout(hoverTimer);
	hoverKey = key;
	hoverTimer = window.setTimeout(() => {
		if (hoverKey === key) startPrefetch(key);
	}, hoverDelay);
}

function onOut(event: MouseEvent) {
	const link = linkFrom(event.target);
	if (!link) return;
	const next = event.relatedTarget;
	if (next instanceof Node && link.contains(next)) return;
	const key = pageKey(link.href);
	if (key && key === hoverKey) {
		window.clearTimeout(hoverTimer);
		hoverKey = '';
	}
}

function onPrepare(event: Event) {
	const prep = event as PrepEvent;
	const original = prep.loader;
	prep.loader = async () => {
		if (prep.formData) {
			await original();
			return;
		}
		const html = await take(prep.to.href);
		if (prep.signal.aborted) return;
		if (!html) {
			await original();
			return;
		}
		const parser = new DOMParser();
		const next = parser.parseFromString(html, 'text/html');
		next.querySelectorAll('noscript').forEach((node) => node.remove());
		prep.newDocument = next;
	};
}

function install() {
	const root = window as Window & { __blnkPrefetch?: boolean };
	scheduleIdle();
	if (root.__blnkPrefetch) return;
	root.__blnkPrefetch = true;
	document.addEventListener('pointerdown', onPointer, true);
	document.addEventListener('focusin', onFocus, true);
	document.addEventListener('mouseover', onOver, true);
	document.addEventListener('mouseout', onOut, true);
	document.addEventListener('astro:before-preparation', onPrepare);
	document.addEventListener('astro:page-load', scheduleIdle);
}

install();
