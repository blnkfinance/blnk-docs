# Global webhooks vs transaction hooks

## Global webhooks

- Delivered after state changes to your notification URL.
- Fire for money movements on **both** `skip_queue: false` and `skip_queue: true`.
- Best for completion on the queued path, and for fan-out / downstream sync on either path.
- Docs: [Global webhooks](https://docs.blnkfinance.com/webhooks/global-webhooks), [Overview](https://docs.blnkfinance.com/webhooks/overview).
- Configure via Blnk notification / webhook settings in config.

## Transaction hooks

- PRE_TRANSACTION / POST_TRANSACTION style interceptors on the request path.
- Best for synchronous checks (fraud, enrichment) that must run with the transaction attempt.
- Docs: [Transaction hooks](https://docs.blnkfinance.com/webhooks/transaction-hooks).
- Respect retries and timeouts documented there; fail closed when PRE hooks must block.

## Choose

| Need | Prefer |
| :-- | :-- |
| Update app after money applied (queued or sync) | Global webhook |
| Block or enrich before apply | Transaction hook (PRE) |
| Side effect after apply on same path | Transaction hook (POST) or global webhook |

You can use both: hooks for guardrails, global webhooks for durable event delivery on either queue mode.
