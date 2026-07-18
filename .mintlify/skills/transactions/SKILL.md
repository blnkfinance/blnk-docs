---
name: blnk-transactions
description: Post and manage applied Blnk transactions—overdraft policy, bulk vs multi-source/destination, scheduling vs cron, backdating, refunds, and lifecycle. Use when creating or updating applied transfers. For holds load blnk-inflight; for skip_queue load blnk-queueing; for amounts load blnk-precision; for cross-currency load blnk-fx; for contention load blnk-queueing hot-balances.
metadata:
  author: blnk
  version: "0.2"
---

# Transactions

Post and manage **applied** money movements. This skill decides *how* to shape and time each post, not the product money map (`blnk-ledger-architecture`) or sync vs async (`blnk-queueing`).

| Concern | Load instead |
| :-- | :-- |
| Holds / commit / void | `blnk-inflight` |
| `skip_queue` per step | `blnk-queueing` |
| Amount encoding | `blnk-precision` |
| Cross-currency legs | `blnk-fx` |
| Hot balance contention | `blnk-queueing` → [references/hot-balances.md](../queueing/references/hot-balances.md) |

Prefer Blnk SDKs (`blnk-sdks` skill). Unique deterministic `reference` (`blnk-naming-patterns`).

## Quick start

```typescript
const response = await blnk.Transactions.create({
  precise_amount: 10000,
  precision: 100,
  reference: 'transfer_f482a1b3-6c2d-4e89-a17b-3d5e8f2a1c94',
  currency: 'USD',
  source: 'bln_source',
  destination: 'bln_dest',
  description: 'P2P transfer',
});
```

Before shipping a post, run the decision checklist below.

## Decision checklist (every post)

1. **Queue** → `blnk-queueing` skill (per step).
2. **Overdraft** → [references/overdraft.md](references/overdraft.md).
3. **One split event vs many posts** → [references/bulk-vs-multi.md](references/bulk-vs-multi.md).
4. **When it should hit the ledger** → [references/timing.md](references/timing.md) (`scheduled_for` vs app cron vs `effective_date`).
5. **Lifecycle after create** → [references/lifecycle.md](references/lifecycle.md) (status, refunds, get-by-reference).

## Canonical request shape

- `precise_amount` (preferred) + `precision`
- Unique `reference`
- `currency`
- `source` / `destination` **or** `sources` / `destinations` arrays
- Optional: `allow_overdraft`, `skip_queue`, `scheduled_for`, `effective_date`, `atomic`, `meta_data`, `description`

## Common failures

| Symptom | Likely cause |
| :-- | :-- |
| Duplicate / discarded | Reused `reference` |
| Insufficient funds | Overdraft disallowed and source empty; fund first or revisit overdraft policy |
| Wrong balances | Bad precision, currency, or split shape |
| Unexpected timing | Mixed up `scheduled_for` (future post) with `effective_date` (past financial date) |

## Docs

- [Create transaction](https://docs.blnkfinance.com/reference/create-transaction)
- [Overdrafts](https://docs.blnkfinance.com/transactions/overdrafts)
- [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions)
- [Multiple sources](https://docs.blnkfinance.com/transactions/multiple-sources) / [destinations](https://docs.blnkfinance.com/transactions/multiple-destinations)
- [Scheduling](https://docs.blnkfinance.com/transactions/scheduling)
- [Backdated transactions](https://docs.blnkfinance.com/transactions/backdated-transactions)
- [Refunds](https://docs.blnkfinance.com/transactions/refunds)
- [Transaction lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle)
