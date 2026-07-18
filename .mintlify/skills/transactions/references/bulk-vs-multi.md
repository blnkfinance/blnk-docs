# Bulk vs multi-source / multi-destination

Docs: [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions), [Multiple sources](https://docs.blnkfinance.com/transactions/multiple-sources), [Multiple destinations](https://docs.blnkfinance.com/transactions/multiple-destinations).

These solve different problems. Do not use bulk to fake a split, or multi-destination to post unrelated intents.

## Quick chooser

| Situation | Use |
| :-- | :-- |
| One economic event, money splits across balances (principal + fee, split payout) | **Multi-source / multi-destination** on a single create |
| Many independent movements in one API call (payroll rows, migration batch, many P2Ps) | **Bulk** (`/transactions/bulk`) |
| One source → one destination | Simple create (`source` + `destination`) |
| Holds / partial capture across legs | `inflight` skill (split + bulk commit/void as needed) |

## Multi-source / multi-destination (one transaction)

Use when the ledger must show **one transaction** with multiple legs.

Examples:

- Customer pays merchant; fee to `@FeesUSD_Stripe`
- Payout split 70/30 across two balances
- Multiple sources funding one destination in a single atomic composition

Rules:

- Use `sources` / `destinations` arrays (not a lone `source`/`destination` when splitting).
- Each entry needs `identifier` plus `distribution` or `precise_distribution`.
- `"left"` takes the remainder after fixed/percentage legs.
- Set `atomic: true` when all legs must succeed together.
- With `precise_amount`, use `precise_distribution` for fixed legs (`precision` skill).
- Name fee / spread balances via `naming-patterns` (`@FeesUSD_*`, etc.). Do not hide fees by shrinking the customer credit with no ledger edge.

## Bulk (many transactions)

Use when each item is its **own** money movement with its own `reference`.

Examples:

- Pay 500 contractors (500 references)
- Import historical posts
- Fan-out many unrelated transfers in one submit

Rules:

- Every item needs a unique deterministic `reference`.
- Decide `skip_queue` per the `queueing` skill; bulk queued submit ≠ every child already applied.
- Duplicate-reference behavior differs for queued vs `skip_queue: true` (read the bulk docs).
- Do not stuff one principal+fee event into bulk as two disconnected posts unless you intentionally want two transactions (prefer multi-destination for one event).

## Anti-patterns

- Bulk of N posts to emulate one split that should be multi-destination
- Multi-destination for unrelated customer payments that should be separate references
- Missing `"left"` or distributions that do not sum correctly
- Assuming bulk `status: applied` on the queue path means every child balance already moved
