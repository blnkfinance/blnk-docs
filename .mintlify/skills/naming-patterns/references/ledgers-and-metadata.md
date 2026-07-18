# Ledgers and metadata naming

## Ledgers

Use **Title Case** names that clearly describe **what is being grouped**. A teammate should know the contents from the name alone.

- Good: `Customer Wallets`, `Card Floats`, `Merchant Payables`, `Lending Receivables`
- Bad: `John Doe`, `temp-ledger-1`, `main`, `ldg1`, `wallets` (too vague / wrong case)

Rules:

1. Title Case every word (`Customer Wallets`, not `customer wallets` or `customer_wallets`).
2. Name by product domain or reporting axis, not by a single user or ephemeral label.
3. Align ledger names with nodes on your money movement map (the `blnk-ledger-architecture` skill).
4. Keep the General Ledger for `@` org balances; put customer balances in custom ledgers.

| Name | What it groups |
| :-- | :-- |
| `Customer Wallets` | End-user spendable balances |
| `Card Floats` | Card program float and related holds |
| `Merchant Payables` | Amounts owed to merchants |
| `Lending Receivables` | Outstanding loan principal balances |

## App balances

- APIs use `balance_id`. If you need a human alias, store it in flat `meta_data` (for example `wallet_label`) or in your own DB mapped to `balance_id`.
- Do not invent a second source of truth for amounts outside Blnk.

## meta_data keys

Keep `meta_data` **flat**. Do not nest objects to group related fields. Link related keys with a shared **prefix**.

| Do | Do not |
| :-- | :-- |
| `order_id`, `order_sku`, `order_channel` | `order: { id, sku, channel }` |
| `fx_exchange_rate`, `fx_quote_id` | `fx: { exchange_rate, quote_id }` |
| `customer_id`, `customer_email` | `customer: { id, email }` |

Rules:

1. Stable `snake_case` keys only.
2. Related fields share a prefix: `<domain>_<field>` (for example `order_`, `fx_`, `payout_`, `card_`).
3. Keys are for join data and audit, not secrets.
4. Document every key on the naming sheet so every service uses the same spellings.

### Prefixed examples

```json
{
  "customer_id": "cus_7f3a2b1c-9d4e-4f8a-b2c1-6e5d4a3b2c1d",
  "customer_email": "ada@example.com",
  "order_id": "ord_a91c2e3f-4b5d-6789-a012-3456789abcde",
  "order_sku": "plan_pro_monthly",
  "order_channel": "web",
  "fx_exchange_rate": "0.79",
  "fx_quote_id": "qt_c5d9e2a1-7b4f-4a3c-9e8d-1f6a2b4c8d30",
  "payout_rail": "bank",
  "payout_external_id": "po_9f8e7d6c-5b4a-4321-9876-543210fedcba"
}
```

Common prefixes:

| Prefix | Typical keys |
| :-- | :-- |
| `customer_` | `customer_id`, `customer_email` |
| `order_` | `order_id`, `order_sku`, `order_channel` |
| `fx_` | `fx_exchange_rate`, `fx_quote_id` |
| `payout_` | `payout_rail`, `payout_external_id` |
| `card_` | `card_auth_code`, `card_merchant_id` |

## Map alignment

Node labels on the money movement map should match ledger names and `@` indicators exactly so engineering and finance share one vocabulary.
