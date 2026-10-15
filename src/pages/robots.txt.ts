import type { APIRoute } from 'astro';
import { absoluteUrl, requireSite } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
	const body = `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml', requireSite(site))}\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
