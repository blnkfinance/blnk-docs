import type { APIRoute } from 'astro';
import { llmsDirectory, loadIndexablePages, requireSite } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
	const pages = await loadIndexablePages();
	return new Response(llmsDirectory(pages, requireSite(site)), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
