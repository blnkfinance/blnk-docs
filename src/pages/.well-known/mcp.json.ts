import type { APIRoute } from 'astro';

const document = {
	version: '1.0.0',
	transport: 'http',
	url: 'https://docs.blnkfinance.com/mcp',
};

export const GET: APIRoute = () => {
	return new Response(JSON.stringify(document), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
