# Managing transactions after create

Docs: [Transaction lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle), [Refunds](https://docs.blnkfinance.com/transactions/refunds), [Parent transactions](https://docs.blnkfinance.com/transactions/parent-transactions).

## Status mindset

- **Async (`skip_queue: false`):** create is not the end state. Confirm applied / rejected / failed via the `blnk-webhooks` skill or poll get-by-reference.
- **Sync (`skip_queue: true`):** the response is the outcome for that request; still use reference-safe retries (`blnk-queueing` skill).

Never tell the user money has moved on the queued path until status is applied (or your product’s confirmed terminal state).

## Day-2 operations

| Need | Approach |
| :-- | :-- |
| Idempotent retry / reconcile | Get by `reference`; store `transaction_id` + `reference` in your DB |
| Reverse an applied movement | [Refunds](https://docs.blnkfinance.com/transactions/refunds) (new reference for the refund) |
| Trace related posts | Parent / child and lineage docs |
| Holds not yet complete | `blnk-inflight` skill (commit / void), not refund |

## Agent rules

1. Prefer SDK create / get / getByReference / refund methods (`blnk-sdks` skill).
2. Refunds and retries never reuse the original movement’s `reference`.
3. Bulk and inflight lifecycle events have their own webhook names; load `blnk-webhooks` when confirming batches.
