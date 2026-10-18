# lookup

Read the ledger before the balance, the balance before the identity, and the identity before the transaction. Search with the nouns of the question, then read the page. Use get_operation for the request and response shape.

The API reference wins when a guide disagrees with it. A guide is for what the movement means. Read the changelog and the migration guides when a Core version is in play. Cite the page title and path.

Open these pages first:

- Inflight: /transactions/inflight/create-inflight, then /transactions/transaction-lifecycle
- Lifecycle and QUEUED: /transactions/transaction-lifecycle and /transactions/parent-transactions
- Reconciliation: /reconciliations/overview
- Precision: /transactions/precision
- Webhooks: /webhooks/overview
- Cloud: /deploy/blnk-cloud
- Watch: /watch/quick-start

# design

Use this when the money movement is still unclear. For each flow, say whose money it is, what comes in, what goes out, and what stays inside. Then read /ledgers/money-movement-map, /balances/internal-balances, /ledgers/architecture, and /identities/introduction before you name a ledger.

A ledger is a folder for balances the team must find and roll up. Do not create one ledger per customer. Link a customer's balances to one identity. Organization-owned balances live in the general ledger.

# implement

Use this when you are about to post, hold, or confirm a movement. Read /reference/create-transaction before you write the call. Do not send status. Blnk sets it.

Choose inflight when other work is still outstanding. The settled balance does not move until commit or void. QUEUED, HTTP 200, or a successful SDK response is not proof the money applied unless the call was synchronous and the body says so.

Read /migrations/core/upgrade and the migration guides between the installed Core version and the current one before you treat the current docs as binding for an older Core.
