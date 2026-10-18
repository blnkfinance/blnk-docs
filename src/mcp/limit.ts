const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;
const hits = new Map<string, number[]>();

/** True when this address is still under 120 requests in the last minute. */
export function allowRequest(address: string, now = Date.now()): boolean {
	const recent = (hits.get(address) ?? []).filter((time) => now - time < WINDOW_MS);
	if (recent.length >= MAX_REQUESTS) {
		hits.set(address, recent);
		return false;
	}
	recent.push(now);
	hits.set(address, recent);
	return true;
}
