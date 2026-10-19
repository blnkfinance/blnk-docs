import type { APIRoute } from 'astro';
import { highlightCode, type HighlightLang } from '../../lib/highlight-code';

export const prerender = false;

const langs = new Set<HighlightLang>(['json', 'plaintext']);

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}

export const POST: APIRoute = async ({ request }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return json({ error: 'The request was not valid.' }, 400);
	}
	if (!payload || typeof payload !== 'object') return json({ error: 'The request was not valid.' }, 400);
	const code = (payload as { code?: unknown }).code;
	const lang = (payload as { lang?: unknown }).lang;
	if (typeof code !== 'string' || code.length > 200_000) return json({ error: 'The request was not valid.' }, 400);
	if (typeof lang !== 'string' || !langs.has(lang as HighlightLang)) return json({ error: 'The request was not valid.' }, 400);
	const html = await highlightCode(code, lang as HighlightLang);
	return json({ html });
};
