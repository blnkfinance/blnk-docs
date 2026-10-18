const repo = 'blnkfinance/blnk';
const ttl = 10 * 60 * 1000;

type Cache = { count: number; at: number };

let cache: Cache | undefined;

/** Star count for the Blnk repo. Cached so the header does not call GitHub on every page. */
export async function githubStarCount(): Promise<number | undefined> {
	const now = Date.now();
	if (cache && now - cache.at < ttl) return cache.count;
	try {
		const response = await fetch(`https://api.github.com/repos/${repo}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'blnk-docs',
			},
		});
		if (!response.ok) return cache?.count;
		const body = (await response.json()) as { stargazers_count?: unknown };
		if (typeof body.stargazers_count !== 'number') return cache?.count;
		cache = { count: body.stargazers_count, at: now };
		return body.stargazers_count;
	} catch {
		return cache?.count;
	}
}
