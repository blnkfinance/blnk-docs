import { field, proxy, type Section } from '../client.ts';

export async function search(section: Section): Promise<void> {
	if (!section.ctx.instanceId) {
		section.skip('POST /proxy/ledgers/filter', 'no connected instance');
		return;
	}

	const stamp = Date.now();
	const name = `enterprise-test-search-${stamp}`;
	const created = await proxy(section, 'POST', '/ledgers', { body: { name } });
	const ledgerId = created.ok ? field(created.body, 'ledger_id') : undefined;

	await proxy(section, 'POST', '/ledgers/filter', {
		body: {
			filters: [{ field: 'name', operator: 'eq', value: name }],
			limit: 5,
		},
	});

	if (ledgerId) {
		await proxy(section, 'POST', `/${ledgerId}/metadata`, {
			body: { meta_data: { source: 'enterprise-api-test' } },
		});
	} else {
		section.skip('POST /proxy/{id}/metadata', 'create ledger did not return a ledger id');
	}

	await proxy(section, 'POST', '/search/ledgers', {
		body: { q: name, query_by: 'name' },
	});
	await proxy(section, 'GET', '/search/reindex');
	section.skip('POST /proxy/search/reindex', 'rebuilds the search index');
}
