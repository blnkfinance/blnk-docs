# Async path (queued)

Use when the **next step does not need** the ledger outcome in this call’s response. Set `skip_queue: false` explicitly **on this call only**.

Sibling steps may still be sync. Example: card **commit/void/settlement** often async even when card **auth** used `skip_queue: true` ([skip-queue-path.md](skip-queue-path.md)).

Complete every step before calling this edge production-ready.

## Behavior you must design for

- Create often returns `QUEUED`. **Do not** treat HTTP/SDK success as final applied money movement.
- Workers apply asynchronously. Confirm the terminal state in your app (`APPLIED`, `REJECTED`, failed, or inflight lifecycle as designed).
- The caller’s “next step” should be acceptance / pending, not settled funds, unless you wait on webhook/poll first.

## Mandatory application path

1. **Unique deterministic `reference`** before the call (`naming-patterns`). Persist it with your business intent.
2. **Post async** (`skip_queue: false`). Persist `transaction_id` / queued parent if you need lineage.
3. **Confirm completion** with one primary path:
   - **Preferred:** webhooks → load the `webhooks` skill (verify HMAC, idempotent handler).
   - **Allowed:** poll get-by-reference / get transaction until terminal.
4. **Update your DB** for settled money only after confirmed terminal state (or model an explicit pending row keyed by `reference`).
5. **UX:** if pending queue impact matters, read balances with queued awareness (`with_queued` where supported). Load `precision` for display.
6. **Ops:** know [queue recovery](https://docs.blnkfinance.com/advanced/queue-recovery) for stuck `QUEUED`.

## Queue-only levers (async only)

| Lever | Do when |
| :-- | :-- |
| Coalescing | Bursts with repeated source/destination/currency overlap |
| Hot-lane | Known hot balances need preferential routing |
| Sharding hot sinks | One treasury/fee/nostro is the hotspot ([hot-balances.md](hot-balances.md)) |

Config: [Queue](https://docs.blnkfinance.com/advanced/configuration/queue), [Transactions](https://docs.blnkfinance.com/advanced/configuration/transactions), [Hot balances](https://docs.blnkfinance.com/guides/hot-balances).

## Do not

- Assume create response means `APPLIED`
- Skip signature verification on webhooks
- Process the same webhook twice as two money events (handlers must be idempotent)
- Flip to sync just to avoid confirmation wiring when the next step is already async-friendly

## Verification checklist

- [ ] Written reason: next step does not need immediate ledger outcome
- [ ] `skip_queue: false` set deliberately
- [ ] Client never assumes immediate `APPLIED` from create alone
- [ ] Webhook or poll covers applied and failed/rejected
- [ ] Webhook signatures verified; handlers idempotent
- [ ] Retries reuse the same `reference`
- [ ] Pending UX defined (or explicitly not needed)
- [ ] Ops runbook for stuck `QUEUED` exists
- [ ] Per-edge choice recorded (map / `.blnk_context/`)
