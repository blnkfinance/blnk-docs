---
name: naming-patterns
description: Consistent names for Blnk ledgers, @ internal balances, transaction references, and meta_data keys. Use when naming indicators, General Ledger balances, references, ledger titles, or metadata join keys.
metadata:
  author: blnk
  version: "0.1"
---

# Naming patterns

Fill a naming sheet before creating resources. Pick what you are naming, then open the matching reference.

## Quick start

1. List ledgers, `@` internals, and reference prefixes on the naming sheet below.
2. Open the matching reference for each kind of name.
3. Continue with the `ledger-architecture` skill for map and layout.
4. When `meta_data` keys are fixed, load the `documentation` skill and write `.blnk_context/NN_metadata-structure.md` (next free number).

## What are you naming?

| Resource | Open |
| :-- | :-- |
| `@` internal / General Ledger balance | [references/internal-balances.md](references/internal-balances.md) |
| Transaction `reference` | [references/transaction-references.md](references/transaction-references.md) |
| Ledger title or `meta_data` keys | [references/ledgers-and-metadata.md](references/ledgers-and-metadata.md) |

## Quick rules

- `@` prefix for org-owned General Ledger balances.
- Standard form: `@<Purpose><Currency>_<Source>` (for example `@WorldUSD_Paypal`).
- Omit currency and/or source when empty (`@World_Paypal`, `@WorldUSD`, `@World`).
- No spaces. Do not put currency or source before purpose.
- Full `@` rules: [references/internal-balances.md](references/internal-balances.md).
- Ledgers: Title Case and descriptive of what is grouped (`Customer Wallets`).
- `meta_data`: flat keys only; link related fields with prefixes (`order_id`, `order_sku`), never nested objects.
- Ledger / metadata rules: [references/ledgers-and-metadata.md](references/ledgers-and-metadata.md).
- References: unique idempotency keys; clean deterministic `intent_stableId[_leg]` (not random per retry).
- Reference rules: [references/transaction-references.md](references/transaction-references.md).

## Naming sheet (output)

```text
Ledgers:
  - <Title Case Name>: <what it groups>

Internal balances (@):
  - @PurposeCurrency_Source: <purpose>

App balances:
  - <alias or meta key> -> balance_id at runtime

Reference prefixes + generator:
  - deposit_ | payout_ | hold_ | fx_ | ...
  - formula: <intent>_<stable_id>[_<leg>] (deterministic on retry)

meta_data keys (flat, prefixed):
  - <prefix_field>: <meaning>

.blnk_context/:
  - NN_metadata-structure.md (via documentation skill)
```
