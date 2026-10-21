import { field, proxy, type Section } from '../client.ts';

export async function balances(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/balances', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const ledger = await proxy(section, 'POST', '/ledgers', {
		body: { name: `enterprise-test-balances-${stamp}` },
	});
	const ledgerId = ledger.ok ? field(ledger.body, 'ledger_id') : undefined;
	if (!ledgerId) {
		section.skip('POST /proxy/balances', 'create ledger did not return a ledger id');
		return;
	}

	const identity = await proxy(section, 'POST', '/identities', {
		body: {
			identity_type: 'individual',
			first_name: 'Balance',
			last_name: `Test${stamp}`,
			email_address: `enterprise-test-balance-${stamp}@example.com`,
		},
	});
	const identityId = identity.ok ? field(identity.body, 'identity_id') : undefined;

	const created = await proxy(section, 'POST', '/balances', {
		body: {
			ledger_id: ledgerId,
			currency: 'USD',
			identity_id: identityId,
			track_fund_lineage: Boolean(identityId),
		},
	});
	const balanceId = created.ok ? field(created.body, 'balance_id') : undefined;
	const indicator = `@EnterpriseTest${stamp}`;
	const internal = await proxy(section, 'POST', '/balances', {
		body: {
			ledger_id: 'general_ledger_id',
			currency: 'USD',
			indicator,
		},
	});

	if (balanceId) {
		await proxy(section, 'GET', `/balances/${balanceId}`);
		await proxy(section, 'GET', `/balances/${balanceId}/lineage`);
		await proxy(section, 'GET', `/balances/${balanceId}`, { query: { from_source: 'true' } });
		await proxy(section, 'GET', `/balances/${balanceId}/at`, {
			query: { timestamp: new Date().toISOString() },
		});
		if (identityId) {
			await proxy(section, 'PUT', `/balances/${balanceId}/identity`, {
				body: { identity_id: identityId },
			});
		} else {
			section.skip('PUT /proxy/balances/{balance_id}/identity', 'create identity did not return an identity id');
		}
	} else {
		section.skip('GET /proxy/balances/{balance_id}', 'create balance did not return a balance id');
	}

	if (internal.ok) {
		await proxy(section, 'GET', `/balances/indicator/${indicator}/currency/USD`);
	} else {
		section.skip('GET /proxy/balances/indicator/{indicator}/currency/{currency}', 'create internal balance failed');
	}

	await proxy(section, 'POST', '/balances-snapshots');

	if (!balanceId) {
		section.skip('POST /proxy/balance-monitors', 'create balance did not return a balance id');
		if (identityId) await proxy(section, 'DELETE', `/identities/${identityId}`);
		return;
	}

	let monitorId: string | undefined;
	try {
		const monitor = await proxy(section, 'POST', '/balance-monitors', {
			body: {
				balance_id: balanceId,
				description: 'Enterprise API test',
				condition: { field: 'debit_balance', operator: '>', value: 100000 },
			},
		});
		monitorId = monitor.ok ? field(monitor.body, 'monitor_id') : undefined;
		if (!monitorId) {
			section.skip('GET /proxy/balance-monitors/{monitor_id}', 'create balance monitor did not return a monitor id');
			section.skip('PUT /proxy/balance-monitors/{monitor_id}', 'create balance monitor did not return a monitor id');
			return;
		}
		await proxy(section, 'GET', `/balance-monitors/${monitorId}`);
		await proxy(section, 'PUT', `/balance-monitors/${monitorId}`, {
			body: {
				balance_id: balanceId,
				description: 'Enterprise API test updated',
				condition: { field: 'debit_balance', operator: '>', value: 200000 },
			},
		});
	} finally {
		if (monitorId) await proxy(section, 'DELETE', `/balance-monitors/${monitorId}`);
		if (identityId) await proxy(section, 'DELETE', `/identities/${identityId}`);
	}
}
