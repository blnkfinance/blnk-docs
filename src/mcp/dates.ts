export const USAGE_ZONE = 'Africa/Lagos';
export const RAW_LINE_DAYS = 30;

/** Calendar date in Africa/Lagos, as YYYY-MM-DD. */
export function lagosDate(date = new Date()): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: USAGE_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date);
}

/** The previous calendar date in Africa/Lagos. */
export function lagosYesterday(now = new Date()): string {
	const [year, month, day] = lagosDate(now).split('-').map(Number);
	const previous = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, (day ?? 1) - 1));
	const y = previous.getUTCFullYear();
	const m = String(previous.getUTCMonth() + 1).padStart(2, '0');
	const d = String(previous.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function lagosWeekday(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	const utc = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, 12));
	return new Intl.DateTimeFormat('en-GB', {
		timeZone: USAGE_ZONE,
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	}).format(utc);
}

export function olderThanDays(isoTime: string, days: number, now = new Date()): boolean {
	const time = Date.parse(isoTime);
	if (Number.isNaN(time)) return true;
	return now.getTime() - time > days * 24 * 60 * 60 * 1000;
}
