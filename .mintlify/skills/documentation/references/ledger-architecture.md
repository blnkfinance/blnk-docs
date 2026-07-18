# Template: ledger architecture

Save as `.blnk_context/NN_ledger-architecture.md` using the **next free** `NN`.

```markdown
# Ledger architecture

Status: accepted
Updated: YYYY-MM-DD

## Context
Reporting and ops needs that drove grouping (from discovery). Link the money movement map doc if it exists.

## Decision

### Grouping rule
One sentence: “We group balances by X because Y.”

### Ledger table
| Ledger | Balances grouped | Why |
| :-- | :-- | :-- |
| General Ledger | @WorldUSD_Paypal, @FeesUSD_Stripe, … | Org-owned @ |
| Customer Wallets | Customer USD/EUR wallets | End-user spendable |

### General Ledger
List `@` internals and ownership.

### Tradeoffs accepted
What you optimized for vs deferred (product reporting vs customer 360, etc.).

## Consequences
Where new balances go; what must stay consistent when products are added.

## Open questions
- …

## Changelog
- YYYY-MM-DD: initial architecture

## See also
- <related NN_slug.md files>
```

Use Title Case ledger names. Keep the grouping rule frozen unless Status and Changelog are updated.
