import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const blockedHost = /^(localhost|.*\.localhost|.*\.local|.*\.internal)$/i;

function hexPairToV4(hi: string, lo: string): string | null {
	const high = Number.parseInt(hi, 16);
	const low = Number.parseInt(lo, 16);
	if (!Number.isInteger(high) || !Number.isInteger(low) || high < 0 || high > 0xffff || low < 0 || low > 0xffff) return null;
	return `${high >> 8}.${high & 0xff}.${low >> 8}.${low & 0xff}`;
}

function mappedV4(ip: string): string | null {
	const normalized = ip.toLowerCase().split('%')[0] ?? ip;
	if (!normalized.startsWith('::ffff:')) return null;
	const rest = normalized.slice('::ffff:'.length);
	if (isIP(rest) === 4) return rest;
	const groups = rest.split(':');
	if (groups.length !== 2) return null;
	return hexPairToV4(groups[0] ?? '', groups[1] ?? '');
}

function isPrivate(ip: string): boolean {
	const normalized = ip.toLowerCase();
	const mapped = mappedV4(normalized);
	if (mapped) return isPrivate(mapped);
	if (isIP(normalized) === 6) {
		if (normalized === '::1' || normalized === '::') return true;
		if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
		if (/^fe[89ab]/.test(normalized) || normalized.startsWith('ff')) return true;
		return false;
	}
	const parts = normalized.split('.').map((part) => Number(part));
	if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
	const [a, b] = parts;
	if (a === 0 || a === 10 || a === 127) return true;
	if (a === 169 && b === 254) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	if (a === 100 && b >= 64 && b <= 127) return true;
	return false;
}

function bareHost(hostname: string): string {
	return hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
}

function publicUrl(baseUrl: string): URL {
	let url: URL;
	try {
		url = new URL(baseUrl);
	} catch {
		throw new Error('Use a public https URL for a sandbox.');
	}
	if (url.protocol !== 'https:' || url.username || url.password) {
		throw new Error('Use a public https URL for a sandbox.');
	}
	const host = bareHost(url.hostname);
	if (blockedHost.test(host) || (isIP(host) && isPrivate(host))) {
		throw new Error('Use a public https URL for a sandbox.');
	}
	if (url.pathname !== '/' && url.pathname !== '') {
		throw new Error('Use the sandbox origin, without a path.');
	}
	return url;
}

async function assertPublic(hostname: string) {
	const host = bareHost(hostname);
	if (isIP(host)) return;
	let records: { address: string }[];
	try {
		records = await lookup(hostname, { all: true, verbatim: true });
	} catch {
		throw new Error('Could not resolve that host.');
	}
	if (records.length === 0 || records.some((record) => isPrivate(record.address))) {
		throw new Error('Use a public https URL for a sandbox.');
	}
}

async function readLimited(response: Response, limit: number): Promise<unknown> {
	const reader = response.body?.getReader();
	if (!reader) return null;
	const chunks: Uint8Array[] = [];
	let size = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > limit) {
			await reader.cancel();
			throw new Error('The response was too large.');
		}
		chunks.push(value);
	}
	const text = new TextDecoder().decode(Buffer.concat(chunks));
	if (!text) return null;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text.slice(0, 2000);
	}
}

/** Call the reader's public Core. The key is forwarded and not stored. */
export async function callCore(options: {
	baseUrl: string;
	apiKey: string;
	method: string;
	path: string;
	body?: Record<string, unknown>;
}): Promise<{ status: number; body: unknown }> {
	const url = publicUrl(options.baseUrl);
	await assertPublic(url.hostname);
	const target = new URL(options.path, url);
	if (target.origin !== url.origin) throw new Error('Use a path on that sandbox.');
	const headers = new Headers();
	headers.set('X-blnk-key', options.apiKey);
	headers.set('Accept', 'application/json');
	let body: string | undefined;
	if (options.body && options.method !== 'GET' && options.method !== 'DELETE') {
		headers.set('Content-Type', 'application/json');
		body = JSON.stringify(options.body);
	}
	let response: Response;
	try {
		response = await fetch(target, {
			method: options.method,
			headers,
			body,
			redirect: 'manual',
			signal: AbortSignal.timeout(10_000),
		});
	} catch {
		throw new Error('Could not reach that sandbox.');
	}
	if (response.status >= 300 && response.status < 400) {
		throw new Error('Core redirected that request.');
	}
	return { status: response.status, body: await readLimited(response, 1_000_000) };
}
