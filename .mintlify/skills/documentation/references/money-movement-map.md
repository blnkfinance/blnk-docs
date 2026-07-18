# Template: money movement map

Save as `.blnk_context/NN_money-movement-map.md` using the **next free** `NN` (creation order). The `01_` in examples elsewhere is only illustrative.

```markdown
# Money movement map

Status: accepted
Updated: YYYY-MM-DD

## Context
Product / workflow this map covers. Link to discovery notes if any.

## Decision

### Summary
Plain-language flow (deposit → … → payout).

### Balances (nodes)
| Balance | Type | Currency | Notes |
| :-- | :-- | :-- | :-- |
| Customer wallet | customer | USD | |
| @WorldUSD_Paypal | system | USD | PayPal rail |

### Movements (edges)
| Name | Source | Destination | Currency | Inflight? | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| deposit_paypal | @WorldUSD_Paypal | Customer wallet | USD | no | |

### Completion / holds
Which edges wait on other work before commit (inflight).

### Maps tool
- Import file: `NN_money-movement-map.json` (if generated; same number as this doc)
- Ask team to import into https://map.blnkfinance.com

## Consequences
Implementation order, webhooks to subscribe to, out-of-scope flows.

## Open questions
- …

## Changelog
- YYYY-MM-DD: initial map

## See also
- <related NN_slug.md files>
```

Fill from the `ledger-architecture` deliverables (context brief, nodes, edges, inflight edges, maps-tool JSON).
