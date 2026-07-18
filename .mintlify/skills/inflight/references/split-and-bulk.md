# Split and bulk inflight

## Split inflight (multiple sources or destinations)

Use when a hold must reserve across several balances in one business operation.

Docs: [Inflight for multiple sources and destinations](https://docs.blnkfinance.com/transactions/inflight/split-inflight).

Follow the same distribution rules as applied multi-destination transactions (`%`, fixed, `"left"`). Load the `blnk-transactions` skill → bulk-vs-multi for split guidance.

## Bulk commit and void

Use when many inflight transactions must finalize together (batch capture, batch cancel).

Docs: [Bulk commit and void](https://docs.blnkfinance.com/transactions/inflight/bulk-update-inflight).

Prefer SDK methods when available (bulk commit/void inflight in TypeScript, Go, Python, and Java). See the `blnk-sdks` skill.

## Checklist

- [ ] Each child/leg has a clear reference strategy
- [ ] Partial failures have a recovery path
- [ ] No holds left open after the batch job finishes
