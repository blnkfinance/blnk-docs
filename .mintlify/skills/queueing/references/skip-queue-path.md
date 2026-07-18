# Sync path (skip queue)

Use when the **next step needs** the ledger outcome before the caller continues. Set `skip_queue: true` explicitly **on this call only**.

Sibling steps in the same journey may be async. Example: card **auth** often sync; card **commit/void** often async ([queued-path.md](queued-path.md)). Do not copy `skip_queue: true` onto settlement just because auth used it.

If this step does **not** need immediacy, use [queued-path.md](queued-path.md) instead. Do not choose sync only to skip confirmation plumbing.

## Behavior you must design for

- Processing is inline with the request. The response is the outcome the next step depends on.
- Coalescing and hot-lane routing do **not** apply (`skip_queue: true`).
- Duplicate-reference behavior on bulk can differ from the async path. Read [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions) before relying on batch semantics.
- Concurrent posts on the same balance can produce **lock errors**. If this edge is high contention, you **must** recommend and implement contention strategies below. Do not ship sync-on-hot without a plan.

## Gate

- [ ] Named next step that requires the ledger result in this request
- [ ] `skip_queue: true` set deliberately (not copied from a sample)
- [ ] Contention profile known (low / medium / high) for source and destination
- [ ] If high contention: strategies from the section below chosen and implemented
- [ ] Retry / timeout strategy is reference-safe

If you cannot name the next step that needs immediacy → **do not** use sync.

## Mandatory application path

1. **Unique deterministic `reference`** before the call (`naming-patterns`).
2. Post with `skip_queue: true`.
3. **Branch on the response** in the request path (success vs error). Drive the next step from that outcome.
4. **Timeouts / ambiguous failures:** fail closed. Reconcile with get-by-reference. **Never** retry with a new reference.
5. Webhooks may still notify downstream systems; do **not** design as if every create starts `QUEUED`.
6. **If the path is high contention:** implement the strategies below before calling it production-ready. Also open [hot-balances.md](hot-balances.md).

## High contention on sync (required)

When many writers hit the same balance (or pair) and you still need sync because of the next step, escalate strategies **in this order**. Do not jump to sharding first.

Optional upfront: if the next step can tolerate “accepted, confirm async,” switch to [queued-path.md](queued-path.md) (unlocks coalescing and hot-lane). Only stay on sync when immediacy is real.

### 1. Set lock wait timeout (first)

Configure `BLNK_TRANSACTION_LOCK_WAIT_TIMEOUT` (seconds) so sync requests wait briefly for balance locks instead of failing immediately, without hanging forever.

- Shorter timeout → snappier responses, more lock errors under load
- Longer timeout → fewer lock errors, higher tail latency for the caller

Pick a starting value with the team, document it in `.blnk_context/`, and ship this before inventing more architecture. See [Lock wait timeout](https://docs.blnkfinance.com/guides/hot-balances#lock-wait-timeout).

### 2. On lock failure, implement reference-safe retries

When a request still fails with lock / contention errors after the wait:

1. Get-by-reference first (maybe a peer already applied this intent).
2. If absent, retry the **same** `reference` with bounded backoff and jitter.
3. Cap attempts; then fail closed to the client with a clear error.
4. Never mint a new `reference` for the same logical movement.

Implement this in the app as soon as lock errors appear (or are expected). Retries without a configured lock wait timeout are not enough.

### 3. Confirm, then recommend balance sharding (last)

Only after lock wait + retries are in place (or clearly insufficient under load), confirm with the user before proposing shards. Do not silently redesign their General Ledger. Follow [how-to-ask.md](../../documentation/references/how-to-ask.md).

Ask in plain language, for example: “Which balances keep locking?” “Can reports roll up several shard balances?” Cover:

- Which balance IDs show lock errors or sit on A→N / N→A / A↔B patterns
- Whether reporting / reconciliation can aggregate multiple shard balances
- What stable routing key exists (customer id, merchant id, order id)
- How many shards they are willing to operate, and who creates them
- Whether they would rather move this edge async instead of sharding

**Assume and confirm when useful:** propose a small shard count and a hash-on-customer (or merchant) key, then let them correct it. Also offer moving the edge async if immediacy is soft.

If sharding is justified, recommend splitting the hot sink/source (for example `@FeesUSD_Stripe_0` … `@FeesUSD_Stripe_19`) with app-side hash routing, and aggregate shards for reports. Follow [Hot balances: sharding](https://docs.blnkfinance.com/guides/hot-balances#sharding-balances) and [hot-balances.md](hot-balances.md). Persist the decision in `.blnk_context/`.

Where useful, also suggest single-flight / serialize writers in one service instance. That complements sharding; it does not replace it for multi-instance apps.

### What will not help on sync

| Lever | On `skip_queue: true` |
| :-- | :-- |
| Coalescing | Not available |
| Hot-lane routing | Not available |
| Retries without lock wait + same `reference` | Unsafe or ineffective |
| Sharding before measuring lock-wait + retry behavior | Premature complexity |

### Implement checklist (high contention + sync)

- [ ] Immediacy re-validated (or edge moved async)
- [ ] Lock wait timeout configured and documented
- [ ] Lock-error retry: same `reference`, backoff, cap, get-by-reference first
- [ ] Hot balances identified (A→N / N→A / A↔B)
- [ ] User confirmed before any shard proposal
- [ ] If sharding: plan named, routing implemented, reporting aggregates shards
- [ ] Load test or staged soak shows acceptable lock-error rate
- [ ] Decision recorded in `.blnk_context/` (sync reason + contention strategies)

## Do not

- Use sync when the next step is “notify later” or “settle in the background”
- Ship sync on a hot path with no lock wait timeout or reference-safe retries
- Jump to sharding without confirming with the user and trying lock wait + retries first
- Ignore lock errors and keep hammering the same balance
- Assume bulk duplicate-reference behavior matches the async path
- Expect coalescing or hot-lane to save a sync hot path

## Verification checklist

- [ ] Next-step immediacy reason written
- [ ] Response handling drives the next step
- [ ] Contention profile assessed
- [ ] If high contention: implement checklist above completed
- [ ] Retry logic is reference-safe
- [ ] Per-edge choice recorded (map / `.blnk_context/`)
