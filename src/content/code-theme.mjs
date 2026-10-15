/**
 * Quiet syntax colors. The block background is the page, set in CSS.
 * @param {'light' | 'dark'} type
 */
export function codeTheme(type) {
	const light = type === 'light';
	const fg = light ? '#3f3f3f' : '#d8d8d8';
	const comment = light ? '#8a8a8a' : '#8f8f8f';
	const string = light ? '#8d5414' : '#e2b17a';
	const keyword = light ? '#37598a' : '#a8c0dc';
	const punctuation = light ? '#6b6b6b' : '#a6a6a6';

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
