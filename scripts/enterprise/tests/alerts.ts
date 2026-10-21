import { field, record, type Context, type Section } from '../client.ts';

export async function alerts(ctx: Context, section: Section): Promise<void> {
	await section.call('GET', '/alerts');
	const listed = await section.call('GET', '/alerts/statuses');
	const colours = coloursFrom(listed.body);
	const colour = colours[0] ?? '#3B82F6';
	const nextColour = colours[1] ?? colour;
	const stamp = Date.now();
	const key = `ENTERPRISE_TEST_${stamp}`;
	let createdKey: string | undefined;

	try {
		const created = await section.call('POST', '/alerts/statuses', {
			body: {
				name: `Enterprise test ${stamp}`,
				colour,
				key,
			},
		});
		createdKey = created.ok ? (field(created.body, 'key') ?? key) : undefined;
		if (createdKey) {
			await section.call('PUT', `/alerts/statuses/${createdKey}`, {
				body: {
					name: `Enterprise test updated ${stamp}`,
					colour: nextColour,
				},
			});
		} else if (created.ok) {
			section.skip('PUT /alerts/statuses/{key}', 'create alert status did not return a key');
			section.skip('DELETE /alerts/statuses/{key}', 'create alert status did not return a key');
		}
	} finally {
		if (createdKey) await section.call('DELETE', `/alerts/statuses/${createdKey}`);
	}

	const instanceId = ctx.instanceId;
	if (!instanceId) {
		section.skip('POST /proxy/ledgers', 'no connected instance');
		section.skip('POST /proxy/balances', 'no connected instance');
		section.skip('POST /alerts/flag/{id}', 'no connected instance');
		section.skip('GET /alerts/{alert_id}', 'no connected instance');
		section.skip('PUT /alerts/flag/{alert_id}', 'no connected instance');
		return;
	}

	const ledger = await section.call('POST', '/proxy/ledgers', {
		query: { instance_id: instanceId },
		body: { name: `enterprise-test-${stamp}` },
	});
	const ledgerId = ledger.ok ? field(ledger.body, 'ledger_id') : undefined;
	if (!ledgerId) {
		section.skip('POST /proxy/balances', 'create ledger did not return a ledger id');
		section.skip('POST /alerts/flag/{id}', 'create ledger did not return a ledger id');
		section.skip('GET /alerts/{alert_id}', 'create ledger did not return a ledger id');
		section.skip('PUT /alerts/flag/{alert_id}', 'create ledger did not return a ledger id');
		return;
	}

	const balance = await section.call('POST', '/proxy/balances', {
		query: { instance_id: instanceId },
		body: {
			ledger_id: ledgerId,
			currency: 'USD',
		},
	});
	const balanceId = balance.ok ? field(balance.body, 'balance_id') : undefined;
	if (!balanceId) {
		section.skip('POST /alerts/flag/{id}', 'create balance did not return a balance id');
		section.skip('GET /alerts/{alert_id}', 'create balance did not return a balance id');
		section.skip('PUT /alerts/flag/{alert_id}', 'create balance did not return a balance id');
		return;
	}

	const flagged = await section.call('POST', `/alerts/flag/${balanceId}`, {
		body: {
			title: 'Enterprise API test',
			description: 'Flag created by the enterprise API test runner.',
		},
	});
	const alertId = flagged.ok ? field(flagged.body, 'anomaly_id') : undefined;
	if (!alertId) {
		section.skip('GET /alerts/{alert_id}', 'create alert did not return an anomaly id');
		section.skip('PUT /alerts/flag/{alert_id}', 'create alert did not return an anomaly id');
		return;
	}

	await section.call('GET', `/alerts/${alertId}`);
	await section.call('PUT', `/alerts/flag/${alertId}`, {
		body: {
			title: 'Enterprise API test updated',
			description: 'Updated by the enterprise API test runner.',
		},
	});
}

function coloursFrom(body: unknown): string[] {
	const value = record(body)?.allowed_colours;
	if (!Array.isArray(value)) return [];
	return value.filter((colour): colour is string => typeof colour === 'string' && colour.length > 0);
}
