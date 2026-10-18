import assert from 'node:assert/strict';
import test from 'node:test';
import { assembleReport } from './report.ts';

test('the daily report is counted from session rows', () => {
	const report = assembleReport('2026-10-17', {
		sessions: '2',
		clients: { Cursor: '2' },
		tools: { search: '3', read_page: 1 },
		pages: [
			{ path: '/balances', title: 'Balances', count: 1 },
			{ path: '/transactions', title: 'Transactions', count: '2' },
		],
		operations: [{ name: 'POST /transactions', count: 1 }],
	});
	assert.equal(report.date, '2026-10-17');
	assert.equal(report.sessions, 2);
	assert.deepEqual(report.clients, { Cursor: 2 });
	assert.deepEqual(report.tools, { search: 3, read_page: 1 });
	assert.deepEqual(report.pages, [
		{ path: '/transactions', title: 'Transactions', count: 2 },
		{ path: '/balances', title: 'Balances', count: 1 },
	]);
	assert.deepEqual(report.operations, [{ name: 'POST /transactions', count: 1 }]);
});

test('a quiet day is an empty report', () => {
	const report = assembleReport('2026-10-17', {
		sessions: 0,
		clients: null,
		tools: null,
		pages: null,
		operations: null,
	});
	assert.equal(report.sessions, 0);
	assert.deepEqual(report.clients, {});
	assert.deepEqual(report.tools, {});
	assert.deepEqual(report.pages, []);
	assert.deepEqual(report.operations, []);
});
