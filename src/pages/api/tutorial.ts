import type { APIRoute } from 'astro';
import { callCore } from '../../lib/tutorial-call';
import { findTutorialAction, requestBody, requestPath } from '../../lib/tutorial';

export const prerender = false;

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
	const record = payload as Record<string, unknown>;
	const baseUrl = record.baseUrl;
	const apiKey = record.apiKey;
	const tutorial = record.tutorial;
	const step = record.step;
	if (typeof baseUrl !== 'string' || baseUrl.length > 300) return json({ error: 'Use a public https URL for a sandbox.' }, 400);
	if (typeof apiKey !== 'string' || !apiKey.trim() || apiKey.length > 500) {
		return json({ error: 'Enter the API key.' }, 400);
	}
	if (typeof tutorial !== 'string' || typeof step !== 'string') return json({ error: 'The request was not valid.' }, 400);

	try {
		if (step === 'connect') {
			const result = await callCore({ baseUrl, apiKey: apiKey.trim(), method: 'GET', path: '/ledgers' });
			const ok = result.status >= 200 && result.status < 300;
			return json({ status: result.status, body: ok ? null : result.body });
		}
		const action = await findTutorialAction(tutorial, step);
		if (!action) return json({ error: 'That step is not part of this tutorial.' }, 400);
		const result = await callCore({
			baseUrl,
			apiKey: apiKey.trim(),
			method: action.method,
			path: requestPath(action, record.fields),
			body: requestBody(action, record.fields),
		});
		return json({ status: result.status, body: result.body });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not reach that sandbox.';
		return json({ error: message }, 400);
	}
};
