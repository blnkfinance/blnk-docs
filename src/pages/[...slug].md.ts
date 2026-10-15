import type { APIRoute } from 'astro';
import { loadIndexablePages } from '../content/seo';

export async function getStaticPaths() {
	const pages = await loadIndexablePages();
	return pages.map((page) => ({
		params: { slug: page.href === '/' ? 'index' : page.href.slice(1) },
		props: { markdown: page.markdown },
	}));
}

export const GET: APIRoute<{ markdown: string }> = ({ props }) => {
	return new Response(props.markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
