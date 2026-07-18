# Timing: schedule, cron, and backdating

Docs: [Scheduling](https://docs.blnkfinance.com/transactions/scheduling), [Backdated transactions](https://docs.blnkfinance.com/transactions/backdated-transactions).

Three different knobs. Do not mix them up.

| Field / approach | Meaning |
| :-- | :-- |
| `scheduled_for` | Blnk posts the transaction **in the future** at that timestamp |
| App **cron** / worker | Your system decides when to call create (now); Blnk is not the scheduler |
| `effective_date` | Financial date in the **past** (or explicit economic date); does not delay processing |

## Scheduled (`scheduled_for`) vs app cron

| Prefer `scheduled_for` | Prefer app cron / worker |
| :-- | :-- |
| One-shot “post this at T” already fully decided | Recurring rules with business conditions (skip if unpaid invoice, recompute amount) |
| No app scheduler available and the payload is fixed | Need gates, approvals, or external API checks right before debit |
| Inflight commit/void scheduled as Core supports | Complex calendars, retries, or multi-step workflows you already own |

Rules:

1. Each occurrence still needs a **unique** `reference` (including cron-created series).
2. Canceling / changing intent: follow scheduling cancel docs for `scheduled_for`; for cron, stop the job and do not post.
3. Recurring “every Monday” is usually **cron creates each post** (or a scheduler you control), unless you deliberately enqueue separate `scheduled_for` rows per occurrence.
4. `scheduled_for` is not backdating. Future process time ≠ past financial date.

## Backdated (`effective_date`)

Use when the money **already economically occurred** earlier than `created_at` (migrations,  statement alignment, corrections).

| Use `effective_date` | Do not use it for |
| :-- | :-- |
| Importing historical ledger activity | Delaying a future post (`scheduled_for` instead) |
| Matching a bank/processor value date | Hiding processing latency |
| Correcting books with an agreed prior financial date | Rewriting history without an audit trail in `meta_data` |

Rules:

1. ISO 8601 timestamps. If omitted, `effective_date` defaults to `created_at`.
2. Processing still happens when you post (subject to queue); only the **financial date** changes.
3. Record why in flat `meta_data` (for example `migration_source`, `statement_date`).
4. Do not confuse with inflight: backdating is about dates, not holds.

## Checklist

- [ ] Future post → `scheduled_for` or cron (chosen deliberately)
- [ ] Past financial date → `effective_date`
- [ ] Recurring + conditions → cron/worker, unique references per run
- [ ] Reason for backdate documented in metadata / `.blnk_context/`
