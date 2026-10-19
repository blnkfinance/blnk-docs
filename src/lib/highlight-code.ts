import { createHighlighter, type Highlighter } from 'shiki';

const themes = {
	light: 'one-light',
	dark: 'one-dark-pro',
} as const;

const langs = ['json', 'plaintext'] as const;

export type HighlightLang = (typeof langs)[number];

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
	highlighter ??= createHighlighter({
		themes: [themes.light, themes.dark],
		langs: [...langs],
	});
	return highlighter;
}

/** Same themes as the docs fences. */
export async function highlightCode(code: string, lang: HighlightLang) {
	const engine = await getHighlighter();
	return engine.codeToHtml(code, {
		lang,
		themes,
		defaultColor: false,
	});
}
