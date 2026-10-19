import { getCollection } from 'astro:content';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const fieldTypes = ['string', 'number', 'boolean', 'amount'] as const;

export type TutorialMethod = (typeof methods)[number];
export type TutorialFieldType = (typeof fieldTypes)[number];

export type TutorialField = {
	name: string;
	type: TutorialFieldType;
	group?: string;
	precision?: number;
	fixed?: string;
};

export type TutorialAction = {
	id: string;
	method: TutorialMethod;
	path: string;
	save?: string;
	response?: string;
	fields: TutorialField[];
};

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const namePattern = /^[A-Za-z_][A-Za-z0-9_]*$/;

function attr(source: string, name: string): string | undefined {
	const match = source.match(new RegExp(`\\b${name}="([^"]*)"`));
	return match?.[1];
}

function validPath(path: string | undefined): path is string {
	return !!path && path.startsWith('/') && !path.includes('..') && !path.includes('//') && !path.includes('?');
}

function fieldsFrom(source: string, tag: 'Field' | 'TutorialInput' | 'TutorialValue'): TutorialField[] | null {
	const fields: TutorialField[] = [];
	for (const field of source.matchAll(new RegExp(`<${tag}\\b([^>]*?)\\/?>`, 'g'))) {
		const name = attr(field[1], 'name');
		const type = attr(field[1], 'type') ?? 'string';
		const group = attr(field[1], 'group');
		const precision = attr(field[1], 'precision');
		const fixed = tag === 'TutorialValue' ? attr(field[1], 'value') : undefined;
		if (!name || !namePattern.test(name) || fields.some((item) => item.name === name)) return null;
		if (!fieldTypes.includes(type as TutorialFieldType)) return null;
		if (group && !namePattern.test(group)) return null;
		if (type === 'amount') {
			if (!precision || !/^\d+$/.test(precision) || Number(precision) < 1) return null;
		} else if (precision) {
			return null;
		}
		if (tag === 'TutorialValue' && fixed == null) return null;
		fields.push({
			name,
			type: type as TutorialFieldType,
			group,
			precision: precision ? Number(precision) : undefined,
			fixed,
		});
	}
	return fields;
}

/** Requests declared on the tutorial page. The route uses these, not a path from the browser. */
export function parseActions(source: string): TutorialAction[] {
	const actions: TutorialAction[] = [];
	for (const block of source.matchAll(/<Action\b([^>]*)>([\s\S]*?)<\/Action>/g)) {
		const id = attr(block[1], 'id');
		const method = attr(block[1], 'method');
		const path = attr(block[1], 'path');
		const save = attr(block[1], 'save');
		const response = attr(block[1], 'response');
		if (!id || !idPattern.test(id) || actions.some((action) => action.id === id)) continue;
		if (!method || !methods.includes(method as TutorialMethod)) continue;
		if (!validPath(path)) continue;
		const fields = fieldsFrom(block[2], 'Field');
		if (!fields) continue;
		actions.push({ id, method: method as TutorialMethod, path, save, response: response ?? save, fields });
	}
	for (const block of source.matchAll(/<TutorialForm\b([^>]*)>([\s\S]*?)<\/TutorialForm>/g)) {
		const id = attr(block[1], 'id');
		const method = attr(block[1], 'method');
		const path = attr(block[1], 'path');
		if (!id || !idPattern.test(id) || actions.some((action) => action.id === id)) continue;
		if (!method || !methods.includes(method as TutorialMethod)) continue;
		if (!validPath(path)) continue;
		const inputs = fieldsFrom(block[2], 'TutorialInput');
		const fixed = fieldsFrom(block[2], 'TutorialValue');
		if (!inputs || !fixed) continue;
		if (fixed.some((field) => inputs.some((input) => input.name === field.name))) continue;
		actions.push({ id, method: method as TutorialMethod, path, fields: [...inputs, ...fixed] });
	}
	return actions;
}

export async function findTutorialAction(tutorial: string, id: string): Promise<TutorialAction | null> {
	if (!idPattern.test(tutorial) || !idPattern.test(id)) return null;
	const entries = await getCollection('docs');
	const entry = entries.find((item) => item.id === `tutorials/${tutorial}` && item.data.tutorial);
	if (!entry) return null;
	return parseActions(entry.body ?? '').find((action) => action.id === id) ?? null;
}

type Json = string | number | boolean | { [key: string]: Json };

/** `4500.00` at precision `100` is `450000`. */
export function preciseAmount(amount: string, precision: number): number {
	if (!/^\d+(\.\d+)?$/.test(amount) || !Number.isInteger(precision) || precision < 1) {
		throw new Error('Enter an amount that fits the precision.');
	}
	const [whole, fraction = ''] = amount.split('.');
	const scale = 10n ** BigInt(fraction.length);
	const extra = fraction ? BigInt(fraction) * BigInt(precision) : 0n;
	if (extra % scale !== 0n) throw new Error('Enter an amount that fits the precision.');
	const precise = BigInt(whole) * BigInt(precision) + extra / scale;
	if (precise > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Enter an amount that fits the precision.');
	return Number(precise);
}

const pathToken = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

function fieldSource(fields: unknown): Record<string, unknown> {
	if (fields == null) return {};
	if (typeof fields !== 'object' || Array.isArray(fields)) throw new Error('The fields were not valid.');
	return fields as Record<string, unknown>;
}

function pathNames(path: string): Set<string> {
	return new Set([...path.matchAll(pathToken)].map((match) => match[1]));
}

/** Fill `{transaction_id}` in the path from that field, and leave it out of the body. */
export function requestPath(action: TutorialAction, fields: unknown): string {
	const names = pathNames(action.path);
	if (names.size === 0) return action.path;
	const source = fieldSource(fields);
	return action.path.replace(pathToken, (_token, name: string) => {
		const field = action.fields.find((item) => item.name === name);
		if (!field) throw new Error('That step is not part of this tutorial.');
		const raw = field.fixed ?? source[name];
		const value = typeof raw === 'string' ? raw.trim() : '';
		if (!value || !/^[A-Za-z0-9_.:@+-]+$/.test(value)) throw new Error('That id is not valid.');
		return encodeURIComponent(value);
	});
}

/** Keep only fields the action declared, and coerce them to the declared type. */
export function requestBody(action: TutorialAction, fields: unknown): Record<string, Json> {
	const source = fieldSource(fields);
	const inPath = pathNames(action.path);
	const body: Record<string, Json> = {};
	for (const field of action.fields) {
		if (inPath.has(field.name)) continue;
		if (field.fixed != null) {
			body[field.name] = coerce(field.fixed, field.type);
			continue;
		}
		const value = source[field.name];
		if (typeof value !== 'string') {
			if (field.type === 'amount') throw new Error('Enter an amount.');
			continue;
		}
		const trimmed = value.trim();
		if (!trimmed) {
			if (field.type === 'amount') throw new Error('Enter an amount.');
			continue;
		}
		if (trimmed.length > 500) throw new Error('A field is too long.');
		if (field.type === 'amount') {
			if (!field.precision) throw new Error('Enter an amount that fits the precision.');
			body.precise_amount = preciseAmount(trimmed, field.precision);
			body.precision = field.precision;
			continue;
		}
		const coerced = coerce(trimmed, field.type);
		if (!field.group) {
			body[field.name] = coerced;
			continue;
		}
		const existing = body[field.group];
		const group = existing && typeof existing === 'object' ? existing : {};
		group[field.name] = coerced;
		body[field.group] = group;
	}
	return body;
}

function coerce(value: string, type: TutorialFieldType): Json {
	if (type === 'number') {
		if (!/^\d+$/.test(value)) throw new Error('Enter a whole number.');
		return Number(value);
	}
	if (type === 'boolean') {
		if (value !== 'true' && value !== 'false') throw new Error('Enter true or false.');
		return value === 'true';
	}
	if (type === 'amount') throw new Error('Enter an amount.');
	return value;
}
