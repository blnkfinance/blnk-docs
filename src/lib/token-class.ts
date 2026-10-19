import type { Element, ElementContent, Properties } from 'hast';
import type { ShikiTransformer } from 'shiki';
import oneDark from '@shikijs/themes/one-dark-pro';
import oneLight from '@shikijs/themes/one-light';

type TokenRule = {
	scope?: string | string[];
	settings?: { foreground?: string };
};

type Theme = {
	colors?: Record<string, string>;
	tokenColors?: TokenRule[];
};

const lightTheme = oneLight as Theme;
const darkTheme = oneDark as Theme;

/** Hex digits for a `#rgb` / `#rrggbb` color. `inherit` and other values are skipped. */
function hex(color: string | undefined): string | undefined {
	const match = color?.trim().match(/^#([0-9a-fA-F]{3,8})$/);
	return match?.[1].toLowerCase();
}

function foregrounds(theme: Theme): Map<string, string> {
	const colors = new Map<string, string>();
	for (const rule of theme.tokenColors ?? []) {
		const color = rule.settings?.foreground;
		if (!hex(color)) continue;
		const scopes = Array.isArray(rule.scope) ? rule.scope : String(rule.scope ?? '').split(',');
		for (const scope of scopes) {
			const key = scope.trim();
			if (key) colors.set(key, color!.trim());
		}
	}
	return colors;
}

function pairs(): Map<string, { light: string; dark: string }> {
	const light = foregrounds(lightTheme);
	const dark = foregrounds(darkTheme);
	const lightDefault = lightTheme.colors?.['editor.foreground'] ?? '';
	const darkDefault = darkTheme.colors?.['editor.foreground'] ?? '';
	const found = new Map<string, { light: string; dark: string }>();
	function add(lightColor: string, darkColor: string) {
		const lightHex = hex(lightColor);
		const darkHex = hex(darkColor);
		if (!lightHex || !darkHex) return;
		found.set(lightHex + darkHex, { light: lightColor.trim(), dark: darkColor.trim() });
	}
	add(lightDefault, darkDefault);
	for (const scope of new Set([...light.keys(), ...dark.keys()])) {
		add(light.get(scope) ?? lightDefault, dark.get(scope) ?? darkDefault);
	}
	return found;
}

const tokenPairs = pairs();

/** Class for a light/dark pair that the stylesheet defines. */
export function tokenClass(light: string, dark: string): string | undefined {
	const lightHex = hex(light);
	const darkHex = hex(dark);
	if (!lightHex || !darkHex) return;
	if (!tokenPairs.has(lightHex + darkHex)) return;
	return `t${lightHex}${darkHex}`;
}

/** Stylesheet for every light/dark pair the two themes can produce for the same scope. */
export function tokenClassCss(): string {
	const rules: string[] = [];
	for (const [key, colors] of tokenPairs) {
		rules.push(
			`.article pre span.t${key}{--shiki-light:${colors.light};--shiki-dark:${colors.dark}}`,
		);
	}
	return `${rules.join('\n')}\n`;
}

function styleText(style: Properties['style']): string {
	if (typeof style === 'string') return style;
	return '';
}

function declarations(style: string): [string, string][] {
	const entries: [string, string][] = [];
	for (const part of style.split(';')) {
		const index = part.indexOf(':');
		if (index < 0) continue;
		const key = part.slice(0, index).trim();
		const value = part.slice(index + 1).trim();
		if (key) entries.push([key, value]);
	}
	return entries;
}

function addClass(properties: Properties, name: string) {
	const current = properties.class;
	if (Array.isArray(current)) {
		if (!current.includes(name)) current.push(name);
		return;
	}
	if (typeof current === 'string' && current.length > 0) {
		const names = current.split(/\s+/);
		if (!names.includes(name)) names.push(name);
		properties.class = names;
		return;
	}
	properties.class = [name];
}

function rewrite(node: Element) {
	const properties = node.properties;
	if (node.tagName === 'span' && properties) {
		const entries = declarations(styleText(properties.style));
		const light = entries.find(([key]) => key === '--shiki-light')?.[1];
		const dark = entries.find(([key]) => key === '--shiki-dark')?.[1];
		const name = light && dark ? tokenClass(light, dark) : undefined;
		if (name) {
			addClass(properties, name);
			const rest = entries.filter(([key]) => key !== '--shiki-light' && key !== '--shiki-dark');
			if (rest.length > 0) properties.style = rest.map(([key, value]) => `${key}:${value}`).join(';');
			else delete properties.style;
		}
	}
	for (const child of node.children) {
		if (isElement(child)) rewrite(child);
	}
}

function isElement(node: ElementContent): node is Element {
	return node.type === 'element';
}

/** Replaces repeated inline theme colors with a shared class. Unknown pairs stay inline. */
export function tokenClassTransformer(): ShikiTransformer {
	return {
		name: 'token-class',
		code(node) {
			rewrite(node);
		},
	};
}
