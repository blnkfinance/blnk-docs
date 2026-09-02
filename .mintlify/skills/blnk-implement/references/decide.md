# Decide the call

One task, one set of answers. Do not copy this list at the user. Ask in their product's words. When a default is obvious, state it and confirm.

Fetch the page before you write the call. Do not memorize fields.

## Is this movement finished?

Ask: is there work outside the ledger that must succeed or fail first?

| If | Then | Fetch |
| :-- | :-- | :-- |
| A bank, processor, chain, or reviewer still has to confirm | Hold. Commit when they confirm. Void when they fail or cancel. Set expiry so abandoned holds do not hang. | [Inflight](https://docs.blnkfinance.com/transactions/inflight/creating-inflight), [Commit and void](https://docs.blnkfinance.com/transactions/inflight/updating-inflight) |
| Both sides already sit in this ledger and nothing else is outstanding | Post applied. | [Create transaction](https://docs.blnkfinance.com/reference/create-transaction) |
| The hold is short (card auth, inbound deposit waiting on the rail) | Inflight. | Same inflight pages |
| The hold would last days and the amount may change (escrow, open FX, memo valuation) | A dedicated balance or memo post is often clearer than inflight. Show both if unsure. | [Inflight](https://docs.blnkfinance.com/transactions/inflight/creating-inflight) |

Inflight is not `QUEUED`. Queue is how the call is processed. Inflight is whether the money is reserved.

On **0.15.0+**, commit and void are queued unless you send `skip_queue: true`. See [version.md](version.md).

A timeout after you may have submitted to a rail is unknown. Look up by the same `reference`. Do not void or send a second payout to "fix" it.

## Events or an instant response?

This is the same question as sync vs async. Version first ([version.md](version.md)). How you confirm and how you look the record up are the same decision.

| Path | Confirm | Look up |
| :-- | :-- | :-- |
| Sync (`skip_queue: true`) | The HTTP/SDK body is the record. Terminal status is in the response. | The `reference` you sent, or `parent_transaction` = the id you got back. No `_q`. |
| Queued | The response means accepted. Drive the app from `transaction.applied`, `transaction.inflight`, `transaction.rejected`, or a later lookup. | The child, not the queued parent. Original `reference` + `_q`, or search `parent_transaction` / `meta_data.QUEUED_PARENT_TRANSACTION` for the queued id. |

Retry still uses the **original** `reference`. `_q` is only for finding the processed child after a queued post.

Bulk and inflight follow the same split. Queued batch children live on `meta_data.QUEUED_PARENT_TRANSACTION`. Sync batch children live on `parent_transaction`. Queued commit/void children share the inflight's `QUEUED_PARENT_TRANSACTION`; their `parent_transaction` is the intermediate job, not the hold. Fetch [Lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle), [Parent transactions](https://docs.blnkfinance.com/transactions/parent-transactions), and [Webhooks](https://docs.blnkfinance.com/webhooks/overview).

- Use instant when checkout, an issuer, or the next post must know now. Webhooks still fire. Do not skip the receiver for other services that listen.
- A Blnk event is the ledger talking. A processor event is not proof the ledger moved. Look up the way this path looks up when they disagree.

## One split or many posts?

These are different shapes. Do not use bulk to fake a split, or a split to post unrelated intents.

| If | Then | Fetch |
| :-- | :-- | :-- |
| One economic event, money splits (principal + fee, merchant + platform) | Multiple destinations or sources on **one** create. | [Multiple destinations](https://docs.blnkfinance.com/transactions/multiple-destinations), [Multiple sources](https://docs.blnkfinance.com/transactions/multiple-sources) |
| Many independent movements (payroll, migration, many P2Ps) | Bulk. Each item has its own `reference`. | [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions) |
| One source, one destination | Simple create. | [Create transaction](https://docs.blnkfinance.com/reference/create-transaction) |
| Two currencies | Two posts through an FX balance, not one balance that changes currency. | [Create transaction](https://docs.blnkfinance.com/reference/create-transaction) |

Splits default to `atomic: false` (partial legs can apply). Set `atomic: true` when all legs must succeed together.

On bulk, decide `skip_queue` and `run_async` from the next step and the Core version, not from habit. A queued bulk `applied` is "batch accepted."

Do not put a fee destination on the request unless that fee actually moves on this call.

## How is the amount stored?

Blnk stores integers. `precision` is how a human amount maps to those integers.

- One precision per currency across the product. USD at `100` and BTC at `100000000` in the same app is expected.
- Prefer `precise_amount` + `precision`. Do not send `amount` and `precise_amount` together.
- Convert in one shared place. Do not sprinkle `100` at every call site.
- Display with the same table you post with. Spendable while holds exist is `balance` minus inflight debit, not `balance` alone.

Fetch [Precision](https://docs.blnkfinance.com/transactions/precision).

## Is this the same business operation?

Same operation, same `reference`. Retry with it. Do not mint a new one because a call timed out.

When the rail already has an id (bank payment, on-chain tx), reuse it. That is what reconciliation matches later.

## Can this source go negative?

`@` internals that represent "outside" start at zero. They usually need overdraft or they cannot send. Customer wallets usually do not.

Ask only when the product is a loan, a float, or something that is allowed to go negative. Fetch [Overdrafts](https://docs.blnkfinance.com/transactions/overdrafts).

## After you post

- Applied, committed, and voided records are immutable. A correction is a new post (refund, void, adjustment). Fetch [Refunds](https://docs.blnkfinance.com/transactions/refunds).
- Legs of one journey share a metadata key so you can find them when events arrive out of order.
- Store the Blnk ids your app will look up (`identity_id`, `balance_id`, `transaction_id`) on your operation record. The app owns customers. The ledger owns balances.
