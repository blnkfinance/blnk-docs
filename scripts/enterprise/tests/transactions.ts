import { field, proxy, type Section } from '../client.ts';

export async function transactions(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/transactions', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const ledger = await proxy(section, 'POST', '/ledgers', {
		body: { name: `enterprise-test-transactions-${stamp}` },
	});
	const ledgerId = ledger.ok ? field(ledger.body, 'ledger_id') : undefined;
	if (!ledgerId) {
		section.skip('POST /proxy/transactions', 'create ledger did not return a ledger id');
		return;
	}

	const source = await balance(section, ledgerId, 'USD');
	const destination = await balance(section, ledgerId, 'USD');
	const other = await balance(section, ledgerId, 'USD');
	if (!source || !destination || !other) {
		section.skip('POST /proxy/transactions', 'create balance did not return a balance id');
		return;
	}

	await proxy(section, 'POST', '/transactions', {
		body: movement(stamp, 'dry', source, destination, { dry_run: true }),
	});

	const applied = await proxy(section, 'POST', '/transactions', {
		body: movement(stamp, 'applied', source, destination),
	});
	const transactionId = applied.ok ? field(applied.body, 'transaction_id') : undefined;
	if (transactionId) {
		await proxy(section, 'GET', `/transactions/${transactionId}`);
		await proxy(section, 'GET', `/transactions/${transactionId}/lineage`);
		await proxy(section, 'GET', `/transactions/reference/enterprise-test-${stamp}-applied`);
		await proxy(section, 'POST', `/refund-transaction/${transactionId}`, {
			body: { skip_queue: true, description: 'Enterprise API test refund' },
		});
	} else {
		section.skip('GET /proxy/transactions/{transaction_id}', 'create transaction did not return a transaction id');
		section.skip('POST /proxy/refund-transaction/{transaction_id}', 'create transaction did not return a transaction id');
	}

	const inflight = await proxy(section, 'POST', '/transactions', {
		body: movement(stamp, 'inflight', source, destination, { inflight: true }),
	});
	const inflightId = inflight.ok ? field(inflight.body, 'transaction_id') : undefined;
	if (inflightId) {
		await proxy(section, 'PUT', `/transactions/inflight/${inflightId}`, {
			body: { status: 'commit', skip_queue: true },
		});
	} else {
		section.skip('PUT /proxy/transactions/inflight/{transaction_id}', 'inflight transaction did not return a transaction id');
	}

	const toCommit = await proxy(section, 'POST', '/transactions', {
		body: movement(stamp, 'bulk-commit', source, destination, { inflight: true }),
	});
	const commitId = toCommit.ok ? field(toCommit.body, 'transaction_id') : undefined;
	if (commitId) {
		await proxy(section, 'POST', '/transactions/inflight/bulk/commit', {
			body: { skip_queue: true, transactions: [{ transaction_id: commitId }] },
		});
	} else {
		section.skip('POST /proxy/transactions/inflight/bulk/commit', 'inflight transaction did not return a transaction id');
	}

	const toVoid = await proxy(section, 'POST', '/transactions', {
		body: movement(stamp, 'bulk-void', source, destination, { inflight: true }),
	});
	const voidId = toVoid.ok ? field(toVoid.body, 'transaction_id') : undefined;
	if (voidId) {
		await proxy(section, 'POST', '/transactions/inflight/bulk/void', {
			body: { skip_queue: true, transaction_ids: [voidId] },
		});
	} else {
		section.skip('POST /proxy/transactions/inflight/bulk/void', 'inflight transaction did not return a transaction id');
	}

	await proxy(section, 'POST', '/transactions', {
		body: {
			precise_amount: 1000,
			precision: 100,
			currency: 'USD',
			reference: `enterprise-test-${stamp}-split`,
			description: 'Enterprise API test split',
			allow_overdraft: true,
			skip_queue: true,
			source,
			destinations: [
				{ identifier: destination, distribution: '50%' },
				{ identifier: other, distribution: 'left' },
			],
		},
	});

	await proxy(section, 'POST', '/transactions/bulk', {
		body: {
			atomic: true,
			skip_queue: true,
			transactions: [
				movement(stamp, 'bulk-a', source, destination),
				movement(stamp, 'bulk-b', source, other),
			],
		},
	});

	section.skip('POST /proxy/transactions/recover', 'recovers queued transactions already on the instance');
}

function movement(
	stamp: number,
	name: string,
	source: string,
	destination: string,
	extra?: Record<string, unknown>,
) {
	return {
		precise_amount: 1000,
		precision: 100,
		currency: 'USD',
		reference: `enterprise-test-${stamp}-${name}`,
		source,
		destination,
		description: 'Enterprise API test',
		allow_overdraft: true,
		skip_queue: true,
		...extra,
	};
}

async function balance(section: Section, ledgerId: string, currency: string): Promise<string | undefined> {
	const created = await proxy(section, 'POST', '/balances', {
		body: { ledger_id: ledgerId, currency },
	});
	return created.ok ? field(created.body, 'balance_id') : undefined;
}
