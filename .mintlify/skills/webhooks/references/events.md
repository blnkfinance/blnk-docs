# Events catalog

Docs: [Supported events](https://docs.blnkfinance.com/webhooks/events).

Subscribe only to what your app needs.

## High-value transaction events

| Event | When |
| :-- | :-- |
| `transaction.applied` | Applied or committed |
| `transaction.inflight` | Hold created |
| `transaction.void` | Inflight voided |
| `transaction.rejected` | Rejected |
| `transaction.scheduled` | Scheduled successfully |
| `bulk_transaction.applied` / `.inflight` / `.failed` | Bulk outcomes |

## Other groups

| Area | Examples |
| :-- | :-- |
| Ledgers | `ledger.created` |
| Balances | `balance.created`, `balance.monitor` |
| Identities | `identity.created` |
| Reconciliations | `reconciliation.completed`, `reconciliation.failed` |
| System errors | See events page |

## Queue and skip_queue

Lifecycle events fire on **both** paths. `skip_queue` only changes whether the create/commit HTTP response is already terminal.

| Path | How to use these events |
| :-- | :-- |
| `skip_queue: false` | Treat `transaction.applied` / `transaction.rejected` (and related) as **completion signals**. Do not treat create HTTP success as final. |
| `skip_queue: true` | Response already carries the outcome for the caller. Events still fire for fan-out, notifications, and other listeners. |

See the `blnk-queueing` skill for choosing the path; keep the same allowlist and handlers regardless of flag.

## Tip

Keep an allowlist of event names in code. Ignore unknown events safely (forward-compatible).
