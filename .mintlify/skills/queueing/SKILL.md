---
name: queueing
description: Choose Blnk queue vs skip_queue per step from whether the next action needs an immediate ledger outcome or can proceed async. Use when setting skip_queue, mixing sync auth with async settlement, handling QUEUED status, or wiring confirmation after create or commit.
metadata:
  author: blnk
  version: "0.5"
---

# Queueing

There is **no default** path for your product. Choose deliberately **per step / per edge**: does the **next step** need the ledger outcome **now**, or can the movement finish **async**?

Different sides of the **same** journey can disagree. Do not force one `skip_queue` value onto every call in a product flow.

| Need | Choice | Flag |
| :-- | :-- | :-- |
| Next step needs the outcome in this request (show balance, unlock UI, chain the next post, fail the HTTP call together) | **Synchronous** | `skip_queue: true` |
| Next step can continue without waiting; apply can finish in the background | **Async** | `skip_queue: false` |

Do not inherit “whatever the SDK omits.” Set the flag on purpose and record why **for that call**.

Docs: [Concurrency](https://docs.blnkfinance.com/guides/concurrency), [Transaction lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle), [Queue config](https://docs.blnkfinance.com/advanced/configuration/queue).

## Mental model

Decide this first, **for each API call** in the journey (ask in plain language):

> After this call returns, does the next step already need to know the ledger result?

- **Yes** → sync → [references/skip-queue-path.md](references/skip-queue-path.md)
- **No** → async → [references/queued-path.md](references/queued-path.md)

Follow [how-to-ask.md](../documentation/references/how-to-ask.md). Walk the flow step-by-step in simple words (“Does checkout need the answer right away?”). Sync on one side does **not** imply sync on the rest.

**Assume and confirm** for familiar patterns:

| Step | Likely choice | Why |
| :-- | :-- | :-- |
| Card **auth** (create inflight hold) | Sync | Issuer / checkout needs approve/decline in the request |
| Card **settlement** (commit / void / capture) | Often async | Clearing can finish in the background; notify via webhook/poll |
| Checkout debit the customer sees immediately | Sync | Next step is the user-facing result |
| Payout “submitted” then partner settles later | Async | Next step is acceptance, not final rail settle |
| Internal bookkeeping with no waiting caller | Async | No immediate next-step dependency |

Propose the table, then ask them to correct any row. Do not re-interview every step from scratch when the pattern is clear.

Load the `inflight` skill for auth → commit/void mechanics; keep queueing decisions independent per call.

When mapping, label **each** edge/step with sync or async. Example:

```text
card_auth (inflight create):     skip_queue: true
card_capture (commit):           skip_queue: false
card_release (void):             skip_queue: false
```

## Hard rules

1. **No product default.** Every mapped step gets an explicit sync or async choice.
2. **Decide from that step’s next dependency**, not from sibling calls. Auth needing sync does not force settlement to sync.
3. **Async:** HTTP/SDK success ≠ money applied (or commit finished). Confirm via webhooks (preferred) or poll-by-reference. Load the `webhooks` skill.
4. **Sync:** design the request path around the response outcome; still use unique deterministic `reference` (`naming-patterns`).
5. Record the per-step table on the map / in `.blnk_context/` (load `documentation`).

## After you choose

For **each** step:

| Choice | You must |
| :-- | :-- |
| Async (`skip_queue: false`) | Complete [references/queued-path.md](references/queued-path.md) |
| Sync (`skip_queue: true`) | Complete [references/skip-queue-path.md](references/skip-queue-path.md) |

Then apply secondary constraints **on sync steps that are hot**:

- Contended / hot balances on **sync** → escalate in order in [references/skip-queue-path.md](references/skip-queue-path.md): **lock wait timeout → reference-safe retries → confirm with the user, then recommend sharding**. Also open [references/hot-balances.md](references/hot-balances.md). Revisit async if immediacy is not truly required.
- High throughput on **async** → coalescing / hot-lane / sharding via [references/hot-balances.md](references/hot-balances.md).

## Anti-patterns (do not)

- Leaving `skip_queue` undecided (“we’ll see”)
- Applying one flag to the whole product because one step needed sync
- Choosing async but treating create/commit success as final without confirmation
- Choosing sync only to avoid building webhook/poll confirmation when that step did not need immediacy
- Sync on a hot path with no lock wait timeout or reference-safe retries
- Jumping to balance sharding without confirming with the user and trying lock wait + retries first
- Blind retry with a new `reference` after timeout
- Mixing sync/async on a journey **without** documenting which step is which

## Persist

Write the per-step sync/async table with the `documentation` skill (next free `NN_<slug>.md`).
