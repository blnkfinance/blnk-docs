# Nostro exchange

Docs: [Currency exchange](https://docs.blnkfinance.com/tutorials/digital-banking/currency-exchange).

## Idea

A **nostro** balance facilitates exchange between currencies. Record **two or more** currency-specific transactions, not one magical cross-currency post. Instant convert is often two legs; multi-day settlement or intermediary balances may need additional legs over time.

Example: customer converts USD → GBP at `$1 = £0.79`:

| Currency | Source | Destination | Purpose |
| :-- | :-- | :-- | :-- |
| USD | customer-usd | `@NostroUSD` | Debit customer USD |
| GBP | `@NostroGBP` | customer-gbp | Credit customer GBP |

When legs must apply together (same-moment convert), link them with [bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions). When settlement spans time or intermediaries, map the flow first (`ledger-architecture`), then post separate transactions correlated by shared order metadata.

## meta_data

Store the rate and quote identifiers on each leg, for example `exchange_rate`, `quote_id`. For multi-leg or multi-day flows, also share an `order_id` (or equivalent) across every related transaction.

## Checklist

- [ ] Money movement map done if settlement is multi-day, multi-hop, or more than two legs
- [ ] `@Nostro{CCY}` (and any intermediaries) exist per the map
- [ ] Amounts computed with shared precision rules
- [ ] Bulk/atomic linking only where legs must succeed or fail together
- [ ] Shared `order_id` in `meta_data` when legs are separate over time
- [ ] Spread handled explicitly if customer rate ≠ market ([spread.md](spread.md))
