import { field, proxy, type Section } from '../client.ts';

export async function ledgers(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/ledgers', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const created = await proxy(section, 'POST', '/ledgers', {
		body: { name: `enterprise-test-${stamp}` },
	});
	const ledgerId = created.ok ? field(created.body, 'ledger_id') : undefined;
	if (!ledgerId) {
		section.skip('GET /proxy/ledgers/{ledger_id}', 'create ledger did not return a ledger id');
		section.skip('PUT /proxy/ledgers/{ledger_id}', 'create ledger did not return a ledger id');
		return;
	}

	await proxy(section, 'GET', `/ledgers/${ledgerId}`);
	await proxy(section, 'PUT', `/ledgers/${ledgerId}`, {
		body: { name: `enterprise-test-updated-${stamp}` },
	});
}
