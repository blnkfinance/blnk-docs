# Upgrade first, then decide

Recommend the **latest** Core before you change how they post. Do not start the integration on an old default and "fix it later."

Managed Cloud: Blnk upgrades Core for them. Still review their **app** against the guides. Self-host: they deploy. Fetch [Upgrade Core](https://docs.blnkfinance.com/changelog/upgrade) either way. Do not copy that page into the chat.

## Detect

Prefer the repo, then the running instance, then ask.

- Docker image tag, Compose, Helm, or Cloud instance version
- SDK pin (`package.json`, `go.mod`) is a hint, not Core
- `GET /health` tells you the process is up. It does not return the Core version.

If you cannot tell, say so and ask. Do not guess a version to skip the review.

## Review their code

1. Fetch [Upgrade Core](https://docs.blnkfinance.com/changelog/upgrade). Read the migration guide index. Open every guide **after** their current version, **up to** latest, oldest first. Fetch each guide. Do not work from this skill's memory of what broke.
2. For each guide, search **their** repo for the behaviour it changes. Name the file and the call.
3. Tell them, in their product's words, what would break if they upgrade now, and what to change so it does not. Prefer keeping the behaviour they need by setting it on the request (for example `skip_queue: true`) over relying on an old default.
4. Then write new work against **latest**. If they stay on the old version for now, say what you are targeting and what will break when they move.

SDK pins: fetch that SDK's changelog too when they use one. A current Core with an old SDK can still surprise them.

## After they are on latest (or you know the gap)

Queue vs instant is a property of **this call on this Core**. Fetch [Concurrency](https://docs.blnkfinance.com/guides/concurrency) and [Lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle) before you set `skip_queue`.

| When | What the call does | Confirm / look up |
| :-- | :-- | :-- |
| Create, latest Core (queue is the default) | Returns `QUEUED`. Worker applies later. | Event, or the child: original `reference` + `_q`, or `parent_transaction` / `QUEUED_PARENT_TRANSACTION`. |
| Create + `skip_queue: true` | **0.8.2+**. Response is the terminal status (`APPLIED`, `INFLIGHT`, `REJECTED`). | The response. Same `reference`, no `_q`. Webhooks still fire for other consumers. |
| Before **0.8.2** | No `skip_queue`. Create is queued. | Events / queued lookup only. Recommend upgrade before you invent a flag. |
| Bulk create | **0.9.0+**. | Fetch [Bulk](https://docs.blnkfinance.com/transactions/bulk-transactions). |
| Bulk before **0.10.5** | Every item is processed in the request. | The response. Children on `parent_transaction`. Review before they cross 0.10.5. |
| Bulk **0.10.5+** | Defaults to queued. `status: "applied"` on the batch means accepted, not that every child moved. | Children on `meta_data.QUEUED_PARENT_TRANSACTION`. Or `skip_queue: true` and look up on `parent_transaction`. |
| Bulk `run_async` | HTTP can return while the batch is still being accepted. Separate from `skip_queue`. | Bulk webhooks when `run_async: true`. Lookup still follows `skip_queue`. |
| Inflight commit / void before **0.15.0** | Applied in the request. Response is `APPLIED` or `VOID`. | The response. Child on `parent_transaction` = the hold. Review before they cross 0.15.0. |
| Inflight commit / void **0.15.0+** | Queued by default. Transaction stays `INFLIGHT` until the worker runs. A second commit/void on the same hold is `409`. | Child on `QUEUED_PARENT_TRANSACTION`. Or `skip_queue: true` and match `parent_transaction` to the hold. |
| Refund `skip_queue` | **0.14.2+**. Body without it stays queued. | Same as create: exact `reference` if sync, `_q` / parent if queued. |

Always re-read the page. Do not treat this table as the API.

## Recommend sync or async

Ask: after this call returns, does the next step already need the ledger result?

| Next step | On a Core that has `skip_queue` | If they cannot use `skip_queue` yet |
| :-- | :-- | :-- |
| Show the new balance, approve/decline a card, fail the HTTP call together, chain a post that reads these balances | Sync. Set `skip_queue: true` on **this** call. | They only have events. Say so. Recommend upgrade. Do not pretend the create response is final. |
| Payout submitted, settlement, bookkeeping, large bulk, hot path | Queue. Confirm with the event or lookup. | Queue. Same confirmation. |

There is no product-wide default. Auth needing sync does not force settlement to sync. Commit needing an instant `APPLIED` on 0.15+ is its own flag, not inherited from create.

Do not choose sync only to avoid wiring webhooks when the next step did not need immediacy. Do not choose queue and then treat create success as money applied, or look it up as if it were sync.

If this sync path is hot (lock errors on the same balances), fetch [Hot balances](https://docs.blnkfinance.com/guides/hot-balances) before you shard.
