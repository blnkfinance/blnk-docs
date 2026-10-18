import type { APIRoute } from 'astro';
import { allowRequest } from '../../mcp/limit';
import { handleMcp } from '../../mcp/http';

export const prerender = false;

async function handle(context: Parameters<APIRoute>[0]): Promise<Response> {
	let address = 'unknown';
	try {
		address = context.clientAddress || 'unknown';
	} catch {
		address = 'unknown';
	}
	if (!allowRequest(address)) return new Response('Too many requests', { status: 429 });
	return handleMcp(context.request);
}

export const GET: APIRoute = (context) => handle(context);
export const POST: APIRoute = (context) => handle(context);
export const DELETE: APIRoute = (context) => handle(context);
