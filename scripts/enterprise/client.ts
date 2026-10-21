import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Context = {
	baseUrl: string;
	apiKey: string;
	instanceId?: string;
	failed: boolean;
};

export type CallResult = {
	ok: boolean;
	status: number;
	body: unknown;
};

type Query = Record<string, string | undefined>;

function loadEnv() {
	const file = join(dirname(fileURLToPath(import.meta.url)), '.env');
	let raw: string;
	try {
		raw = readFileSync(file, 'utf8');
	} catch {
		return;
	}
	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eq = trimmed.indexOf('=');
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) process.env[key] = value;
	}
}

export function createContext(): Context {
	loadEnv();
	const baseUrl = process.env.ENTERPRISE_BASE_URL?.replace(/\/$/, '');
	const apiKey = process.env.ENTERPRISE_API_KEY;
	if (!baseUrl || !apiKey) {
		console.error('Set ENTERPRISE_BASE_URL and ENTERPRISE_API_KEY.');
		process.exit(1);
	}
	return { baseUrl, apiKey, failed: false };
}

export class Section {
	failed = false;
	ctx: Context;

	constructor(ctx: Context) {
		this.ctx = ctx;
	}

	skip(label: string, reason: string) {
		console.log(`\n${label}\nskipped: ${reason}`);
	}

	async call(method: string, path: string, options?: { query?: Query; body?: unknown }): Promise<CallResult> {
		const target = withQuery(path, options?.query);
		const label = `${method} ${target}`;
		try {
			const response = await fetch(`${this.ctx.baseUrl}${target}`, {
				method,
				headers: headers(this.ctx.apiKey, options?.body !== undefined),
				body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
			});
			const body = await readBody(response);
			const ok = response.status >= 200 && response.status < 300;
			console.log(`\n${label}`);
			console.log(ok ? 'works' : `failed ${response.status}`);
			console.log(formatBody(body));
			if (!ok) this.failed = true;
			return { ok, status: response.status, body };
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.log(`\n${label}`);
			console.log('failed');
			console.log(message);
			this.failed = true;
			return { ok: false, status: 0, body: message };
		}
	}
}

export async function run(
	ctx: Context,
	name: string,
	fn: (section: Section) => Promise<void>,
): Promise<void> {
	const section = new Section(ctx);
	console.log(`\n${name}`);
	try {
		await fn(section);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.log(`\n${name}\nfailed\n${message}`);
		section.failed = true;
	}
	if (section.failed) ctx.failed = true;
	else console.log(`\n${name} is successful`);
}

export function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function record(value: unknown): Record<string, unknown> | undefined {
	if (value && typeof value === 'object' && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return undefined;
}

export function rows(value: unknown): unknown[] {
	if (Array.isArray(value)) return value;
	const obj = record(value);
	if (!obj) return [];
	for (const key of ['data', 'instances', 'items', 'results']) {
		if (Array.isArray(obj[key])) return obj[key];
	}
	return [];
}

export function field(body: unknown, key: string): string | undefined {
	return text(record(body)?.[key]);
}

export async function proxy(
	section: Section,
	method: string,
	path: string,
	options?: { query?: Query; body?: unknown },
): Promise<CallResult> {
	const instanceId = section.ctx.instanceId;
	const label = `${method} /proxy${path}`;
	if (!instanceId) {
		section.skip(label, 'no connected instance');
		return { ok: false, status: 0, body: '' };
	}
	return section.call(method, `/proxy${path}`, {
		query: { instance_id: instanceId, ...options?.query },
		body: options?.body,
	});
}

export function firstInstanceId(body: unknown): string | undefined {
	for (const row of rows(body)) {
		const id = field(row, 'instance_id');
		if (id) return id;
	}
	return field(body, 'instance_id');
}

function headers(apiKey: string, hasBody: boolean): HeadersInit {
	const result: Record<string, string> = { 'X-blnk-key': apiKey };
	if (hasBody) result['Content-Type'] = 'application/json';
	return result;
}

function withQuery(path: string, query?: Query): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined) params.set(key, value);
	}
	const qs = params.toString();
	return qs ? `${path}?${qs}` : path;
}

async function readBody(response: Response): Promise<unknown> {
	const raw = await response.text();
	if (!raw) return '';
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		return raw;
	}
}

function formatBody(body: unknown): string {
	if (body === '') return '(empty)';
	if (typeof body === 'string') return body;
	return JSON.stringify(body, null, 2);
}
