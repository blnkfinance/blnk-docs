import type { ThemeRegistration } from 'shiki';

/**
 * Syntax colors for the page background. Light colors are darker so they
 * hold on a near-white page. Dark colors are lighter and more saturated
 * so they stay readable on the dark page.
 */
export function codeTheme(type: 'light' | 'dark'): ThemeRegistration {
	const light = type === 'light';
	const fg = light ? '#1f1f1f' : '#f3f3f3';
	const comment = light ? '#5c5c5c' : '#b8b8b8';
	const string = light ? '#9a4100' : '#ffc46a';
	const keyword = light ? '#1e40af' : '#93c8ff';
	const punctuation = light ? '#4b4b4b' : '#d4d4d4';

	return {
		name: light ? 'blnk-light' : 'blnk-dark',
		type,
		colors: {
			'editor.background': '#00000000',
			'editor.foreground': fg,
		},
		tokenColors: [
			{ settings: { foreground: fg } },
			{
				scope: ['comment', 'punctuation.definition.comment'],
				settings: { foreground: comment },
			},
			{
				scope: ['string', 'constant.numeric', 'constant.language'],
				settings: { foreground: string },
			},
			{
				scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'support.function', 'entity.name.function'],
				settings: { foreground: keyword },
			},
			{
				scope: ['punctuation'],
				settings: { foreground: punctuation },
			},
		],
	};
}
