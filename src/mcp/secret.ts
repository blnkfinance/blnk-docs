import { createHash, timingSafeEqual } from 'node:crypto';

/** Compare two strings without leaking which one mismatched. */
export function secretMatches(provided: string, expected: string): boolean {
	const left = createHash('sha256').update(provided).digest();
	const right = createHash('sha256').update(expected).digest();
	return timingSafeEqual(left, right);
}

export function bearer(header: string | null): string {
	if (!header) return '';
	const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
	return match?.[1] ?? '';
}
