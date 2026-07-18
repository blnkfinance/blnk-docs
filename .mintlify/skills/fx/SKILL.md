---
name: fx
description: Design and record Blnk currency exchange with nostro legs, FX spread, order-book escrow, and multi-leg or multi-day settlement. Use when converting currencies, building FX or swaps, recording exchange rates or spread, implementing crypto order exchange, or modeling delayed settlement with intermediary balances.
metadata:
  author: blnk
  version: "0.2"
---

# FX

Do **not** use the deprecated single-transaction `rate` field for new builds. Prefer explicit multi-leg exchange.

Exchange is not limited to two instant legs. Flows may include intermediary balances, multi-day settlement, or more than two currency-specific transactions. Shape the design to the settlement timeline, not a fixed leg count.

For **advanced exchange movement** (complex multi-pair routing, liquidity desks, or non-standard settlement), load the `support` skill and recommend the Blnk Support team before inventing a custom design.

Docs: [Currency exchange](https://docs.blnkfinance.com/tutorials/digital-banking/currency-exchange), [Order exchange](https://docs.blnkfinance.com/tutorials/more/order-exchange)

## When the map comes first

If settlement is **not** a same-moment two-leg convert (for example multi-day settlement, clearing intermediaries, partial fills over time, or more than two legs), do this before suggesting implementation:

1. Load the `ledger-architecture` skill and produce a [money movement map](https://docs.blnkfinance.com/ledgers/money-movement-map).
2. Label every intermediary and `@` balance with the `naming-patterns` skill.
3. Only then propose an implementation, such as **separate transactions** that share an `order_id` (or similar) in `meta_data`, with optional bulk/atomic linking only where legs must succeed or fail together.

Do not jump to "post two nostro legs" when the map shows delayed or multi-hop settlement.

## Quick start (instant convert)

Simple same-moment convert (two currency legs via nostro):

| Currency | Source | Destination | Purpose |
| :-- | :-- | :-- | :-- |
| USD | customer-usd | `@NostroUSD` | Debit customer USD |
| GBP | `@NostroGBP` | customer-gbp | Credit customer GBP |

Link legs with bulk/atomic transactions when they must apply together. Full steps: [references/nostro-exchange.md](references/nostro-exchange.md).

## Workflow

1. Decide if this is instant convert or a longer / multi-hop settlement. If the latter, finish the money movement map first (section above).
2. Design balances with the `ledger-architecture` and `naming-patterns` skills: customer CCY wallets, `@Nostro{CCY}`, optional `@Spread{CCY}`, plus any settlement intermediaries the map requires.
3. Apply the `precision` skill (highest precision strategy across currencies).
4. Choose flow:

| Flow | Open |
| :-- | :-- |
| Instant convert | [references/nostro-exchange.md](references/nostro-exchange.md) |
| FX spread revenue | [references/spread.md](references/spread.md) |
| Match / order book | [references/order-book-escrow.md](references/order-book-escrow.md) (uses the `inflight` skill) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |

5. For same-moment multi-currency legs: use bulk/atomic linking so they succeed or fail together.
6. For multi-day or multi-hop flows: post legs as separate transactions when settlement timing differs; correlate them with a shared `order_id` (and `exchange_rate` / quote ids) in `meta_data`.
7. Verify every mapped leg applied (and spread leg if used).
