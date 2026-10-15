// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';

const regular = './src/assets/fonts/Graphik-Regular.woff2';
const italic = './src/assets/fonts/Graphik-RegularItalic.woff2';
const medium = './src/assets/fonts/Graphik-Medium.woff2';

/**
 * @param {number} weight
 * @param {'normal' | 'italic'} style
 * @param {string} file
 * @returns {{ weight: number, style: 'normal' | 'italic', src: [string], display: 'swap' }}
 */
function face(weight, style, file) {
	return {
		weight,
		style,
		src: [file],
		display: 'swap',
	};
}

// https://astro.build/config
export default defineConfig({
	integrations: [mdx()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Graphik',
			cssVariable: '--font-graphik',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					face(400, 'normal', regular),
					face(400, 'italic', italic),
					face(500, 'normal', medium),
					face(600, 'normal', medium),
					face(700, 'normal', medium),
				],
			},
		},
	],
});
