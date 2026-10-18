import assert from 'node:assert/strict';
import test from 'node:test';
import { lagosDate, lagosYesterday, olderThanDays } from './dates.ts';
import { secretMatches } from './secret.ts';
import { pagePath, readNote, searchScore, sectionUnder, sliceLines } from './text.ts';

test('page paths drop the markdown extension', () => {
	assert.equal(pagePath('transactions/inflight.mdx'), '/transactions/inflight');
	assert.equal(pagePath('/transactions/inflight/'), '/transactions/inflight');
});

test('read_page slices 200 lines and names the next offset', () => {
	const text = Array.from({ length: 250 }, (_, index) => `line ${index + 1}`).join('\n');
	const slice = sliceLines(text);
	assert.equal(slice.text.split('\n')[0], 'line 1');
	assert.equal(slice.text.split('\n').at(-1), 'line 200');
	assert.equal(slice.remaining, 50);
	assert.equal(slice.nextOffset, 201);
	assert.match(readNote(slice.remaining, slice.nextOffset), /offset 201/);
});

test('heading section stops at the next heading of the same level', () => {
	const markdown = '# Title\n\n## Inflight\n\nhold\n\n## Next\n\nlater';
	assert.equal(sectionUnder(markdown, 'Inflight'), '## Inflight\n\nhold\n');
});

test('search ranks the title above the body', () => {
	const title = searchScore('Inflight', 'something else', 'no match here', 'inflight');
	const body = searchScore('Other', 'something else', 'inflight in the body', 'inflight');
	assert.ok(title > body);
});

test('yesterday is the previous Lagos calendar date', () => {
	const morning = new Date('2026-10-18T00:30:00.000Z');
	assert.equal(lagosDate(morning), '2026-10-18');
	assert.equal(lagosYesterday(morning), '2026-10-17');
});

test('raw lines older than 30 days are due to drop', () => {
	const now = new Date('2026-10-18T12:00:00.000Z');
	assert.equal(olderThanDays('2026-09-01T00:00:00.000Z', 30, now), true);
	assert.equal(olderThanDays('2026-10-01T00:00:00.000Z', 30, now), false);
});

test('secret comparison matches the full value', () => {
	assert.equal(secretMatches('same-secret', 'same-secret'), true);
	assert.equal(secretMatches('same-secret', 'other-secret'), false);
	assert.equal(secretMatches('', 'same-secret'), false);
});
