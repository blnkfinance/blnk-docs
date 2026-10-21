import { field, proxy, type Section } from '../client.ts';

export async function reconciliation(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/reconciliation/matching-rules', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	let ruleId: string | undefined;
	try {
		const created = await proxy(section, 'POST', '/reconciliation/matching-rules', {
			body: {
				name: `enterprise-test-${stamp}`,
				description: 'Amount and currency matcher from the enterprise API test.',
				criteria: [
					{ field: 'amount', operator: 'equals', allowable_drift: 0.01 },
					{ field: 'currency', operator: 'equals' },
				],
			},
		});
		ruleId = created.ok ? field(created.body, 'rule_id') : undefined;
		if (!ruleId) {
			section.skip('PUT /proxy/reconciliation/matching-rules/{rule_id}', 'create matching rule did not return a rule id');
			return;
		}
		await proxy(section, 'PUT', `/reconciliation/matching-rules/${ruleId}`, {
			body: {
				name: `enterprise-test-updated-${stamp}`,
				description: 'Updated by the enterprise API test runner.',
				criteria: [
					{ field: 'amount', operator: 'equals', allowable_drift: 0.01 },
					{ field: 'reference', operator: 'contains' },
				],
			},
		});
	} finally {
		if (ruleId) await proxy(section, 'DELETE', `/reconciliation/matching-rules/${ruleId}`);
	}

	section.skip('POST /proxy/reconciliation/upload', 'upload expects a CSV or JSON file');
	section.skip('POST /proxy/reconciliation/start', 'a run needs uploaded external records');
	section.skip('POST /proxy/reconciliation/start-instant', 'a run needs uploaded external records');
	section.skip('GET /proxy/reconciliation/{reconciliation_id}', 'a run needs uploaded external records');
}
