import type { APIRoute } from 'astro';
import { skillFile, skillIndex } from '../../../skills/catalog';

export const prerender = false;

const headers = { 'Cache-Control': 'public, max-age=300' };

export const GET: APIRoute = ({ params }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '');
	if (path.includes('..')) return new Response('Not found', { status: 404 });
	if (path === 'index.json') {
		return new Response(JSON.stringify(skillIndex()), {
			headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
		});
	}
	const slash = path.indexOf('/');
	if (slash <= 0) return new Response('Not found', { status: 404 });
	const file = skillFile(path.slice(0, slash), path.slice(slash + 1));
	if (!file) return new Response('Not found', { status: 404 });
	return new Response(file.body, { headers: { ...headers, 'Content-Type': file.type } });
};
