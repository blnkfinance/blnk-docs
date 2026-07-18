---
name: precision
description: Encode and display Blnk amounts correctly with precise_amount and a single precision source of truth (prefer currency enums). Use when handling cents, zero-decimal currencies, available balance display, converting human amounts, or preventing precision drift across services.
metadata:
  author: blnk
  version: "0.2"
---

# Precision

Wrong precision causes silent money bugs. Blnk stores ledger amounts as integers; `precision` is how you map human decimals to those integers.

Decide encoding **before** the first post, put it in one shared module (prefer **enums**), and reuse that module everywhere. Never sprinkle magic `100`s across services.

Docs: [Transaction precision](https://docs.blnkfinance.com/transactions/precision).

## Quick start

```text
human $10.00  →  precise_amount: 1000, precision: 100
```

1. Define a currency → precision map once ([references/currency-rules.md](references/currency-rules.md)). Prefer enums / typed constants, not env vars or copy-pasted literals.
2. Convert only through shared helpers ([references/amount-helpers.md](references/amount-helpers.md)).
3. Prefer `precise_amount` + `precision` on every write. Do not send both `amount` and `precise_amount`.
4. For spendable UI while holds exist, use [references/available-balance.md](references/available-balance.md).

## Mental model

| Field | Role |
| :-- | :-- |
| `precise_amount` | Integer in smallest units (recommended write path) |
| `precision` | Scale factor (`human ≈ precise_amount / precision`) |
| `amount` | Float path Blnk can derive; avoid for app writes (15-digit limit, drift risk) |

Balance fields are integers in minor units. Core does **not** return `precision` on balances. Your app must divide by the same precision used when posting.

## Workflow

1. Lock the precision table for every currency in the product (and highest-precision strategy if multi-currency / crypto+fiat).
2. Encode that table as enums or typed constants in one package. Import it from API, workers, SDKs wrappers, and UI formatters.
3. Convert human ↔ precise only via helpers that read that table (never hardcode `precision: 100` at call sites).
4. Post with `precise_amount` + `precision` from the table.
5. Display balances with the same table. For holds, apply available-balance rules.
6. For FX legs, also load the `fx` skill.

## Hard rules

1. **Different currencies may use different precisions.** USD at `100` and BTC at `100000000` in the same product is fine and expected.
2. **One precision per currency** across the whole product. No drift between services for the same currency code.
3. **Enums (or typed constants) beat env** for the precision map. Env is for secrets and URLs, not money scale.
4. Prefer `precise_amount` with an explicit `precision` on every write.
5. Never send `amount` and `precise_amount` together.
6. For multi-currency products (especially crypto + fiat), follow Blnk multi-currency guidance when a shared ledger scale is required. See [Multi-currency balances](https://docs.blnkfinance.com/balances/introduction#multi-currency-balances). That does not forbid a per-currency table for ordinary posts.
7. Round with an explicit policy inside helpers; do not rely on float leftovers.

## References

| Topic | Open |
| :-- | :-- |
| Currency table / no-drift source of truth | [references/currency-rules.md](references/currency-rules.md) |
| Convert human ↔ precise | [references/amount-helpers.md](references/amount-helpers.md) |
| Spendable / UI amounts | [references/available-balance.md](references/available-balance.md) |
