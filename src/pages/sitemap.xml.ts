import type { APIRoute } from 'astro';
import { absoluteUrl, loadIndexablePages, requireSite, xmlEscape } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
	const origin = requireSite(site);
	const pages = await loadIndexablePages();
	const urls = pages
		.map((page) => `\t<url><loc>${xmlEscape(absoluteUrl(page.href, origin))}</loc></url>`)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
