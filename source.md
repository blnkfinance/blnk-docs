I’ve got you! Let’s tighten everything up and deliver a clean, consistent final version.

---

Blnk’s Filter API lets you retrieve exactly the data you need from any collection. Use server-side filters with a clean JSON interface to build precise, composable queries.

## Filter Endpoints

Each collection has a dedicated filter endpoint:

| Collection | Endpoint |
| --- | --- |
| Ledgers | `POST /ledgers/filter` |
| Balances | `POST /balances/filter` |
| Transactions | `POST /transactions/filter` |
| Identities | `POST /identities/filter` |
| Accounts | `POST /accounts/filter` |

## Request Format

```json
{
  "filters": [
    { "field": "status", "operator": "eq", "value": "APPLIED" },
    { "field": "currency", "operator": "in", "values": ["USD", "EUR"] }
  ],
  "sort_by": "created_at",
  "sort_order": "desc",
  "include_count": true,
  "limit": 20,
  "offset": 0
}
```

## Response Format

When `include_count` is true:

```json
{
  "data": [...],
  "total_count": 150
}
```

When `include_count` is false (default):

```json
[ ... ]
```

### Filter Object

Each filter in the `filters` array follows this structure:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| field | string | Yes | The field to filter on |
| operator | string | Yes | The comparison operator |
| value | any | For single-value ops | The value to compare against |
| values | array | For in/between ops | Array of values (for those ops) |

### Supported Operators

| Operator | Description | Example |
| --- | --- | --- |
| eq | Equal to | `{"field": "status", "operator": "eq", "value": "APPLIED"}` |
| ne | Not equal to | `{"field": "status", "operator": "ne", "value": "VOID"}` |
| gt | Greater than | `{"field": "amount", "operator": "gt", "value": 1000}` |
| gte | Greater than or equal | `{"field": "amount", "operator": "gte", "value": 1000}` |
| lt | Less than | `{"field": "amount", "operator": "lt", "value": 5000}` |
| lte | Less than or equal | `{"field": "amount", "operator": "lte", "value": 5000}` |
| in | In a set of values | `{"field": "currency", "operator": "in", "values": ["USD", "EUR"]}` |
| between | Between two values | `{"field": "amount", "operator": "between", "values": [1000, 5000]}` |
| like | Pattern match (case-sensitive) | `{"field": "name", "operator": "like", "value": "%savings%"}` |
| ilike | Pattern match (case-insensitive) | `{"field": "name", "operator": "ilike", "value": "%USD%"}` |
| isnull | Field is null | `{"field": "identity_id", "operator": "isnull"}` |
| isnotnull | Field is not null | `{"field": "identity_id", "operator": "isnotnull"}` |

**Note:** For `like` and `ilike`, use `%` as a wildcard. `%savings%` matches any value containing "savings". For `isnull`/`isnotnull`, the `value` property is ignored.

## Sorting

| Parameter | Values | Default | Description |
| --- | --- | --- | --- |
| sort_by | Any indexed field | created_at | Field to sort by |
| sort_order | asc, desc | desc | Sort direction |

Only indexed fields (e.g., `created_at`, `balance_id`, etc.) are sortable. Sorting on non-indexed fields returns a 400 error.

## Pagination

| Parameter | Default | Max | Description |
| --- | --- | --- | --- |
| limit | 20 | 100 | Max records to return |
| offset | 0 | - | Records to skip |

If `include_count` is true, an additional query will run to fetch the total count, which may impact performance on large datasets.

## Filterable Fields

### Transactions

| Field | Type | Description |
| --- | --- | --- |
| transaction_id | string | Unique transaction identifier |
| reference | string | Custom reference |
| amount | number | Transaction amount |
| currency | string | Currency code |
| status | string | QUEUED, APPLIED, INFLIGHT, VOID |
| source | string | Source balance ID |
| destination | string | Destination balance ID |
| created_at | timestamp | Creation time |
| description | string | Transaction description |
| balance_id | string | Related balance (for internal mapping) |
| meta_data.* | any | Custom metadata fields |

### Balances

| Field | Type | Description |
| --- | --- | --- |
| balance_id | string | Balance identifier |
| ledger_id | string | Parent ledger |
| identity_id | string | Associated identity |
| indicator | string | Balance alias |
| currency | string | Currency code |
| balance | number | Current balance |
| credit_balance | number | Total credits |
| debit_balance | number | Total debits |
| created_at | timestamp | Creation time |
| meta_data.* | any | Custom metadata fields |

### Ledgers

| Field | Type | Description |
| --- | --- | --- |
| ledger_id | string | Ledger identifier |
| name | string | Ledger name |
| created_at | timestamp | Creation time |
| meta_data.* | any | Custom metadata fields |

### Identities

| Field | Type | Description |
| --- | --- | --- |
| identity_id | string | Identity identifier |
| first_name | string | First name |
| last_name | string | Last name |
| email_address | string | Email |
| identity_type | string | Identity type |
| category | string | Category |
| country | string | Country |
| created_at | timestamp | Creation time |
| meta_data.* | any | Custom metadata fields |

### Accounts

| Field | Type | Description |
| --- | --- | --- |
| account_id | string | Account identifier |
| name | string | Account name |
| number | string | Account number |
| bank_name | string | Bank name |
| currency | string | Currency |
| ledger_id | string | Parent ledger |
| balance_id | string | Associated balance |
| created_at | timestamp | Creation time |
| meta_data.* | any | Custom metadata fields |

## Filtering Metadata

To filter on custom metadata, use dot notation for the field name:

```json
{
  "filters": [
    { "field": "meta_data.customer_type", "operator": "eq", "value": "premium" }
  ]
}
```

## Examples

### High-value applied transactions

```bash
curl -X POST http://localhost:5001/transactions/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "status", "operator": "eq", "value": "APPLIED" },
      { "field": "amount", "operator": "gte", "value": 10000 }
    ],
    "sort_by": "amount",
    "sort_order": "desc",
    "limit": 50
  }'
```

### USD balances with positive balance

```bash
curl -X POST http://localhost:5001/balances/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "currency", "operator": "eq", "value": "USD" },
      { "field": "balance", "operator": "gt", "value": 0 }
    ],
    "include_count": true
  }'
```

### Transactions in date range

```bash
curl -X POST http://localhost:5001/transactions/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "created_at", "operator": "gte", "value": "2024-01-01" },
      { "field": "created_at", "operator": "lt", "value": "2024-04-01" }
    ]
  }'
```

### Multiple currencies with pattern search

```bash
curl -X POST http://localhost:5001/ledgers/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "name", "operator": "ilike", "value": "%savings%" }
    ],
    "sort_by": "name",
    "sort_order": "asc"
  }'
```

### Transactions by balance

```bash
curl -X POST http://localhost:5001/transactions/filter \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "balance_id", "operator": "eq", "value": "bln_abc123" }
    ],
    "include_count": true,
    "limit": 100
  }'
```

## Error Handling

Invalid filters return a `400 Bad Request`:

```json
{
  "error": "invalid field 'invalid_field' for collection 'transactions'"
}
```

Common issues:

- Invalid field name for the collection
- Unsupported operator
- Incorrect value type for the field
- Missing required filter properties

## Query Parameter Filters (Alternative)

For simpler queries, you can use query parameters on GET list endpoints:

```
GET /transactions?status_eq=APPLIED&currency_in=USD,EUR&limit=50
```

Format: `field_operator=value`.

This is useful for simple queries, but the POST filter endpoints are recommended for complex filtering, sorting, and counting.

## See Also

- Search API: `/search/overview`
- Transactions: `/transactions/overview`
- Balances: `/balances/overview`
- Ledgers: `/ledgers/overview`

---

## Performance Tuning

Blnk is optimized out of the box for most workloads. This guide is for teams processing millions of records who want to squeeze out extra performance.

## Default indexes

These fields are already indexed and optimized:

| Table | Indexed fields |
| --- | --- |
| `transactions` | `transaction_id`, `reference`, `status`, `currency`, `source`, `destination`, `parent_transaction`, `created_at`, `meta_data` (GIN) |
| `balances` | `balance_id`, `ledger_id`, `identity_id`, `indicator`, `currency`, `created_at` |
| `ledgers` | `ledger_id`, `created_at` |
| `identity` | `identity_id`, `country`, `created_at` |
| `accounts` | `account_id`, `ledger_id`, `identity_id`, `balance_id`, `created_at` |

## Use Typesense for large-scale queries

For complex searches, filtering across millions of records, or when you need sub-millisecond response times, use Blnk’s Typesense integration instead of database queries.

Typesense is optimized for:

- Full-text search across any field
- Faceted filtering with instant results
- Sorting large datasets without custom indexes

See **Search API** (`/search/overview`) for setup and usage.

## Adding custom indexes

If you’re not using Typesense and frequently sort or filter by a specific field at scale, add an index.

```sql
-- Sort transactions by amount
CREATE INDEX CONCURRENTLY IFNOTEXISTS idx_transactions_amountON blnk.transactions (amount);

-- Sort balances by current balance
CREATE INDEX CONCURRENTLY IFNOTEXISTS idx_balances_balanceON blnk.balances (balance);

-- Filter + sort combo (most efficient for this pattern)
CREATE INDEX CONCURRENTLY IFNOTEXISTS idx_transactions_status_amountON blnk.transactions (status, amount);
```

## Metadata indexes

If you frequently filter on a specific metadata key, index that key directly.

```sql
-- Index a specific metadata key
CREATE INDEX CONCURRENTLY IFNOTEXISTS idx_transactions_customer_typeON blnk.transactions ((meta_data->>'customer_type'));
```

## Debugging slow queries

Use `EXPLAIN ANALYZE` to see how Postgres executes a query:

```sql
EXPLAIN ANALYZESELECT*FROM blnk.transactionsWHERE status='APPLIED'ORDERBY amountDESC
LIMIT50;
```

What to look for:

- `Seq Scan` on large tables: strong signal you need an index
- High actual time values
- Large row counts being filtered down late