# FX spread

Docs: [Recording FX spread](https://docs.blnkfinance.com/tutorials/digital-banking/currency-exchange#recording-fx-spread).

When the customer rate differs from market (revenue or volatility buffer), **record the spread as its own movement**.

Example: market `$1 = £0.79`, customer gets `$1 = £0.77` on `$1000`:

| Currency | Source | Destination | Amount | Purpose |
| :-- | :-- | :-- | --: | :-- |
| USD | customer-usd | `@NostroUSD` | 1000.00 | Debit USD |
| GBP | `@NostroGBP` | customer-gbp | 770.00 | Credit customer |
| GBP | `@NostroGBP` | `@SpreadGBP` | 20.00 | Spread revenue |

## Rules

- Name spread balances clearly (`@SpreadGBP`, or `@SpreadGBP_<Source>` when needed).
- Do not hide spread by only shrinking the customer credit without a ledger edge.
- Report spread from `@Spread{CCY}` balances for finance.
