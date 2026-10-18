import type { APIRoute } from 'astro';
import { bearer, secretMatches } from '../../../mcp/secret';
import { yesterdayReport } from '../../../mcp/usage';

export const prerender = false;

function missing(): Response {
	return new Response('Not found', { status: 404 });
}

export const GET: APIRoute = async ({ request }) => {
	const expected = process.env.DOCS_MCP_USAGE_SECRET ?? '';
	if (!expected) return missing();
	if (!secretMatches(bearer(request.headers.get('authorization')), expected)) return missing();
	const report = await yesterdayReport();
	return new Response(JSON.stringify(report), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
