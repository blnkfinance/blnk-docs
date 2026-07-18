# Template: metadata structure

Save as `.blnk_context/NN_metadata-structure.md` using the **next free** `NN`.

```markdown
# Metadata structure

Status: accepted
Updated: YYYY-MM-DD

## Context
Join keys and audit fields needed by connected tools and ops. Flat keys only (no nested objects).

## Decision

### Rules
- Flat `snake_case` keys
- Related fields share a prefix (`order_`, `fx_`, `customer_`, …)
- No secrets or raw PII beyond what ops already require

### Key catalog
| Key | Meaning | Used on |
| :-- | :-- | :-- |
| customer_id | App customer id | balances, txns |
| order_id | Commerce / transfer order | txns |
| order_sku | SKU or plan code | txns |
| fx_exchange_rate | Quoted rate | FX legs |
| fx_quote_id | Provider quote id | FX legs |

### Example payload

Use a flat object, for example:

- `customer_id`: app customer id
- `order_id`: commerce / transfer order
- `order_sku`: SKU or plan code
- `fx_exchange_rate`: quoted rate
- `fx_quote_id`: provider quote id

(When writing the real `.blnk_context` file, include a single flat JSON example.)

## Consequences
All services must use this catalog. New keys require an update here before ship.

## Open questions
- …

## Changelog
- YYYY-MM-DD: initial catalog

## See also
- <related NN_slug.md files>
```

Do not nest objects to group fields. Prefixes link related keys.
