# Internal balance naming

From [Internal balances: naming conventions](https://docs.blnkfinance.com/balances/internal-balances#3-naming-conventions).

## Standard form

```text
@<Purpose><Currency>_<Source>
```

| Part | Meaning | When empty |
| :-- | :-- | :-- |
| `Purpose` | What the balance is for (`World`, `Fees`, `Nostro`, `Spread`, `PayIn`, …) | Required |
| `Currency` | ISO code glued to purpose (`USD`, `GBP`, …) | Omit the currency segment |
| `Source` | Rail, partner, or channel after `_` (`Paypal`, `Stripe`, `Card`, …) | Omit `_` and the source |

Examples:

| Indicator | Purpose | Currency | Source |
| :-- | :-- | :-- | :-- |
| `@WorldUSD_Paypal` | World | USD | Paypal |
| `@World_Paypal` | World | (none) | Paypal |
| `@WorldUSD` | World | USD | (none) |
| `@World` | World | (none) | (none) |
| `@FeesUSD_Stripe` | Fees | USD | Stripe |
| `@NostroGBP` | Nostro | GBP | (none) |
| `@SpreadGBP` | Spread | GBP | (none) |
| `@EscrowUSD_OrderBook` | Escrow | USD | OrderBook |

## Expansive example

Product: multi-currency wallet with card issuing, PayPal and Stripe deposits, bank payouts, and USD↔GBP convert with spread.

```text
# External world / rails
@WorldUSD_Paypal          # USD in/out via PayPal
@WorldUSD_Stripe          # USD in/out via Stripe
@WorldUSD_Card            # USD card network settle
@WorldGBP_Bank            # GBP bank rail
@WorldEUR                 # EUR external (rail not disambiguated yet)
@World_Crypto             # Crypto rail, currency varies by leg

# Pay-in / pay-out faces (optional when distinct from World)
@PayInUSD_Paypal
@PayOutGBP_Bank

# Fees by rail
@FeesUSD_Stripe
@FeesUSD_Card
@FeesGBP_Bank

# Treasury
@FundingPoolUSD
@FundingPoolGBP

# FX
@NostroUSD                # USD nostro (no single LP source)
@NostroGBP
@NostroUSD_LP1            # If you segregate by liquidity provider
@NostroGBP_LP1
@SpreadUSD
@SpreadGBP

# Holds / escrow
@EscrowUSD_CardAuth       # Card authorize holds
@EscrowUSD_OrderBook      # FX / swap order book
@EscrowGBP_PayoutReview   # Payout waiting on ops review

# Revenue (same purpose, different currency or channel)
@RevenueUSD_App
@RevenueEUR_App
@RevenueUSD_Cards
```

How the same movement picks a name:

| Journey | Typical `@` balances |
| :-- | :-- |
| Deposit via PayPal (USD) | `@WorldUSD_Paypal` → customer wallet (or `@PayInUSD_Paypal` if you split the face) |
| Card spend settle (USD) | customer wallet → `@WorldUSD_Card`; fee → `@FeesUSD_Card` |
| Bank payout (GBP) | customer wallet → `@WorldGBP_Bank` (inflight via `@EscrowGBP_PayoutReview` if reviewed first) |
| Convert USD → GBP | customer-USD → `@NostroUSD`; `@NostroGBP` → customer-GBP; spread → `@SpreadGBP` |
| App subscription fee (EUR) | customer-EUR → `@RevenueEUR_App` |

Omit empty segments only; do not leave a dangling `_`. Prefer adding `Currency` or `Source` when reporting or reconciliation needs the split (for example two PayPal wallets in different regions → `@WorldUSD_PaypalUS` / `@WorldUSD_PaypalEU`).

## Rules

1. Always use the `@` prefix so the balance lands in the General Ledger and is easy to reference in code.
2. Follow `@<Purpose><Currency>_<Source>`. Do not invent alternate orders (for example not `@USD_World` or `@World-USD`).
3. Purpose is PascalCase. Currency is uppercase ISO. Source is PascalCase or a stable partner name. No spaces.
4. Do not reuse one indicator for the same function across currencies or sources. Prefer `@RevenueUSD_App` and `@RevenueEUR_App`, not one shared `@Revenue`.
5. Keep names short so sources and destinations stay readable in requests.

## Common purposes

| Purpose | Use |
| :-- | :-- |
| `World` | External money in/out |
| `Fees` | Fee sink |
| `FundingPool` | Treasury / funding |
| `PayIn` / `PayOut` | Rail-facing receive / send |
| `Nostro` | FX nostro per currency |
| `Spread` | FX spread revenue |
| `Escrow` | Holds / order-book |

## Anti-patterns

- `@Temp`, `@Misc`, `@Test` in production maps
- Hyphenated currency (`@Nostro-USD`) instead of glued (`@NostroUSD`)
- Currency or source before purpose (`@USD_World`, `@Paypal_World`)
- Double underscore or trailing `_` when source is empty
- `@Revenue` twice for USD and EUR (or two rails) without disambiguation
- Spaces or punctuation that break indicators
- Encoding customer IDs into `@` names (use app balances + identities instead)
