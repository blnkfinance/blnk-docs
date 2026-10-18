import type { APIRoute } from 'astro';
import { githubStarCount } from '../lib/github-stars';

export const prerender = false;

export const GET: APIRoute = async () => {
	const count = await githubStarCount();
	if (count == null) {
		return new Response(JSON.stringify({ count: null }), {
			status: 503,
			headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
		});
	}
	return new Response(JSON.stringify({ count }), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=600',
		},
	});
};
