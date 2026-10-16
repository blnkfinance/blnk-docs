import { prepareSvg } from './prepare';

const files = import.meta.glob('./line/*.svg', {
	query: '?raw',
	import: 'default',
}) as Record<string, () => Promise<string>>;

const loaders = new Map<string, () => Promise<string>>();
for (const [path, load] of Object.entries(files)) {
	const name = path.slice(path.lastIndexOf('/') + 1, -'.svg'.length);
	loaders.set(name, load);
}

/** Names from the previous Lucide set. A MingCute file with the same name wins. */
const aliases: Record<string, string> = {
	activity: 'heartbeat',
	'arrow-left-right': 'transfer',
	'book-open': 'book',
	'circle-check': 'check-circle',
	info: 'information',
	lightbulb: 'bulb',
	'magnifying-glass': 'search-2',
	rotate: 'refresh-2',
	'rotate-cw': 'refresh-2',
	'scale-balanced': 'balance',
	search: 'search-2',
	'sliders-horizontal': 'settings-2',
	'triangle-alert': 'alert',
	user: 'user-3',
	water: 'drop',
};

export function resolveIcon(icon: string): string {
	if (loaders.has(icon)) return icon;
	return aliases[icon] ?? icon;
}

export async function renderIcon(
	icon: string,
	size = 16,
	attrs: Record<string, string> = {},
): Promise<string | undefined> {
	const load = loaders.get(resolveIcon(icon));
	if (!load) return undefined;
	return prepareSvg(await load(), size, attrs);
}
