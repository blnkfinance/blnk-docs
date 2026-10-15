import type { APIRoute } from 'astro';
import { llmsFull, loadIndexablePages, requireSite } from '../content/seo';

export const GET: APIRoute = async ({ site }) => {
	const pages = await loadIndexablePages();
	return new Response(llmsFull(pages, requireSite(site)), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
