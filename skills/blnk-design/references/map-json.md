# Map JSON and share link

The map deliverable is a **clickable URL**. They open it and see the workflow on [map.blnkfinance.com](https://map.blnkfinance.com).

Build the JSON below, then run `scripts/shorten-map-url.mjs`. Paste the short URL in chat. Do not stop at a prose diagram.

Format matches [mmm-canvas](https://github.com/blnkfinance/mmm-canvas) (`src/lib/llm-prompt.ts`, `src/lib/share.ts`).

## Shape

```json
{
  "name": "Customer wallets",
  "nodes": [],
  "edges": []
}
```

- `name` is the workflow title.
- `nodes` are balances, transactions, and optional inflight controllers.
- `edges` connect them left to right. `source` → `target`.
- IDs are unique and readable (`bal_customer_usd`, `txn_deposit`, not `bal_1`).

## Node types

- **`balance-node`:** a place money sits. `data.balance.type` is `customer`, `internal`, `system`, or `psp`. Internal and system labels use `@`.
- **`transaction-node`:** a movement. `data.transaction.inflight` is true when the movement is not finished yet.
- **`inflight-controller-node`:** commit or void for an inflight transaction. `data.controller.transactionId` matches that transaction's `id`.

Every node has `id`, `type`, `position` (`x`, `y`), and `data`. Lay out left to right (sources ~50, transactions ~380, destinations ~700). Space `y` by ~180.

## Edges

```json
{
  "id": "e_deposit",
  "source": "bal_payin",
  "target": "txn_deposit",
  "type": "workflow-edge",
  "animated": false,
  "data": { "isInflight": false }
}
```

- Balance → transaction is the debit.
- Transaction → balance is the credit.
- Set `animated` and `data.isInflight` to `true` on every edge that touches an inflight transaction.

## Example

```json
{
  "name": "Bank deposit",
  "nodes": [
    {
      "id": "bal_payin",
      "type": "balance-node",
      "position": { "x": 50, "y": 200 },
      "data": {
        "type": "balance",
        "label": "@PayInUSD_Bank",
        "balance": {
          "id": "bal_payin",
          "identifier": "PayInUSD_Bank",
          "ledgerId": "ldg_general",
          "currency": "USD",
          "type": "internal",
          "allowOverdraft": true
        }
      }
    },
    {
      "id": "txn_deposit",
      "type": "transaction-node",
      "position": { "x": 380, "y": 200 },
      "data": {
        "type": "transaction",
        "label": "txn_deposit",
        "transaction": {
          "id": "txn_deposit",
          "amount": 10000,
          "currency": "USD",
          "precision": 100,
          "reference": "txn_deposit",
          "description": "Bank deposit",
          "inflight": false,
          "allowOverdraft": true,
          "atomic": false,
          "runAsync": false,
          "metadataSchema": [],
          "splitDestinations": [],
          "status": "draft"
        }
      }
    },
    {
      "id": "bal_customer",
      "type": "balance-node",
      "position": { "x": 700, "y": 200 },
      "data": {
        "type": "balance",
        "label": "customer_usd",
        "balance": {
          "id": "bal_customer",
          "identifier": "customer_usd",
          "ledgerId": "ldg_wallets",
          "currency": "USD",
          "type": "customer",
          "allowOverdraft": false
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e_src",
      "source": "bal_payin",
      "target": "txn_deposit",
      "type": "workflow-edge",
      "animated": false,
      "data": { "isInflight": false }
    },
    {
      "id": "e_dst",
      "source": "txn_deposit",
      "target": "bal_customer",
      "type": "workflow-edge",
      "animated": false,
      "data": { "isInflight": false }
    }
  ]
}
```

## Share link

From the skill directory:

```bash
node scripts/shorten-map-url.mjs path/to/workflow.json
```

The script LZ-string-encodes the payload (same as mmm-canvas `encodeWorkflow`), builds `https://map.blnkfinance.com/s#<token>`, then POSTs that URL to `https://map.blnkfinance.xyz/shorten`. Print the `shortUrl` it returns. If shorten fails, print the long URL.

Put the URL in chat as a markdown link. That is the map.
