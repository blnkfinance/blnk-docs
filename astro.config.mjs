// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkContentImages } from './src/content/remark-content-images.mjs';

const regular = './src/assets/fonts/Graphik-Regular.woff2';
const italic = './src/assets/fonts/Graphik-RegularItalic.woff2';
const medium = './src/assets/fonts/Graphik-Medium.woff2';
const geistRegular = './src/assets/fonts/GeistMono-Regular.woff2';
const geistMedium = './src/assets/fonts/GeistMono-Medium.woff2';

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
	markdown: {
		remarkPlugins: [remarkContentImages],
	},
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
		{
			provider: fontProviders.local(),
			name: 'Geist Mono',
			cssVariable: '--font-geist-mono',
			fallbacks: ['monospace'],
			options: {
				variants: [
					face(400, 'normal', geistRegular),
					face(500, 'normal', geistMedium),
					face(600, 'normal', geistMedium),
					face(700, 'normal', geistMedium),
				],
			},
		},
	],
});
