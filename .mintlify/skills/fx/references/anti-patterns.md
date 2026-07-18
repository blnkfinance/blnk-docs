# FX anti-patterns

- Using deprecated single-transaction `rate` for new products ([rates](https://docs.blnkfinance.com/transactions/rates))
- One leg that “just works” across currencies without nostro accounting
- Mutating balances outside transactions
- Mixing precisions across currencies without a documented strategy
- Hiding spread inside a single credit amount with no `@Spread{CCY}` edge
- Skipping the money movement map before inventing nostro names
- Forcing a two-leg bulk convert onto multi-day or multi-hop settlement
- Suggesting implementation (including shared `order_id` metadata) before the money movement map when settlement is delayed or multi-leg
- Treating order-book holds as ordinary applied transfers
