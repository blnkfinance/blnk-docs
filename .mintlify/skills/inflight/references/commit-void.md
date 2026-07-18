# Commit and void

Docs: [Commit and void inflight](https://docs.blnkfinance.com/transactions/inflight/updating-inflight).

## Commit

- Full commit: apply the entire held amount.
- Partial commit: apply part; handle leftover (commit remainder or void).
- Scheduled commit: when settlement is time-based.

## Void

- Releases the hold without applying.
- Use for cancel, decline, unmatched orders, expiry.

## Dual-write failure playbook

When your app updates Blnk **and** another system (second currency leg, external payment, shop inventory):

1. Prefer Blnk as the source of truth for money state.
2. Sequence so you can detect partial success (unique references per leg).
3. If Blnk commit succeeds and a later step fails:
   - Do not silently ignore. Log with both references.
   - Compensate with an explicit reversing transaction or void path where still valid.
   - Surface an ops alert; do not invent balance patches outside transactions.
4. If the later step succeeds and Blnk fails, retry Blnk with the **same** reference or reconcile via get-by-reference before posting a new one.

Campfire-style failure mode to avoid: “first asset committed, second asset debit failed” with no recovery runbook.

## Idempotency

Drive commit/void with stable ids. Retries must be safe if the hold was already finalized.
