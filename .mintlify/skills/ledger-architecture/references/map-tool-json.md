# Map tool JSON

Build an importable workflow for [map.blnkfinance.com](https://map.blnkfinance.com). Your **deliverable is JSON**. Do not treat a prose diagram as the final map artifact.

**Required chat line:** after you emit the JSON, tell the user in the chat reply to import it at [map.blnkfinance.com](https://map.blnkfinance.com).

Docs: [Money movement map](https://docs.blnkfinance.com/ledgers/money-movement-map).

## When to use

After the product flow is clear (plain-language steps + named balances). Produce JSON here, then continue to [architecture-choices.md](architecture-choices.md).

## Output contract

1. Emit one JSON object matching the schema below.
2. Use fresh UUIDs for every `id` field (nodes, edges, nested `balance.id`, `transaction.id`, `controller.id`).
3. Leave `validationErrors` as `[]`. Do not copy warnings from sample exports.
4. Omit UI-only fields: `selected`, `dragging`, `positionAbsolute`.
5. In the chat reply, say they should import the JSON at [map.blnkfinance.com](https://map.blnkfinance.com). Link the file path or provide the JSON to copy.

## Top-level shape

```json
{
  "name": "Product flow name",
  "nodes": [],
  "edges": []
}
```

## Node types

### Balance (`balance-node`)

```json
{
  "id": "<uuid>",
  "type": "balance-node",
  "position": { "x": 40, "y": 40 },
  "data": {
    "type": "balance",
    "label": "Customer balance",
    "balance": {
      "id": "<uuid>",
      "identifier": "Customer balance",
      "ledgerId": "ldg_default",
      "currency": "USD",
      "type": "customer",
      "allowOverdraft": false
    },
    "validationErrors": []
  },
  "width": 162,
  "height": 103
}
```

| `balance.type` | Use for |
| :-- | :-- |
| `customer` | User / wallet balances (no `@` prefix) |
| `system` | External world / rail-facing `@` balances (for example `@WorldUSD`, `@WorldUSD_Paypal`) |
| `internal` | Org internals (for example `@FeesUSD_Stripe`, `@NostroUSD`, `@SpreadGBP`, `@EscrowUSD`) |

`identifier` and `label` should match. Use a single `@` on internals (never `@@`). Follow the `naming-patterns` skill.

### Transaction (`transaction-node`)

```json
{
  "id": "<uuid>",
  "type": "transaction-node",
  "position": { "x": 354, "y": 93 },
  "data": {
    "type": "transaction",
    "label": "deposit-card",
    "transaction": {
      "id": "<uuid>",
      "amount": 100,
      "amountLocked": false,
      "currency": "USD",
      "reference": "deposit-card",
      "description": "Card deposit",
      "inflight": false,
      "allowOverdraft": false,
      "atomic": false,
      "runAsync": false,
      "metadataSchema": [],
      "splitSources": [],
      "splitDestinations": []
    },
    "validationErrors": []
  },
  "width": 200,
  "height": 98
}
```

- Set `inflight: true` when the movement waits on other work (load the `inflight` skill). Use height `118` when inflight.
- Prefer stable, readable `reference` / `label` values (not random demo refs). Load `naming-patterns` for reference style.
- Use illustrative amounts; the map is a design artifact, not funded balances.

### Inflight controller (`inflight-controller-node`)

Only when the linked transaction has `inflight: true`.

```json
{
  "id": "<uuid>",
  "type": "inflight-controller-node",
  "position": { "x": 378, "y": 322 },
  "data": {
    "type": "inflight-controller",
    "label": "COMMIT Controller",
    "controller": {
      "id": "<uuid>",
      "transactionId": "<transaction-node id>",
      "action": "commit"
    },
    "validationErrors": []
  }
}
```

`controller.transactionId` must be the **transaction node** `id` (not `transaction.id` inside `data`). Use `action`: `commit` or `void` as the map intends. Label accordingly (`COMMIT Controller` / `VOID Controller`).

## Edges (`workflow-edge`)

Every simple transfer needs two money edges:

1. Source balance → transaction
2. Transaction → destination balance

If inflight, also:

3. Transaction → inflight controller

```json
{
  "id": "<uuid>",
  "source": "<source-node-id>",
  "target": "<target-node-id>",
  "type": "workflow-edge",
  "animated": true,
  "data": {
    "currency": "USD",
    "isInflight": true
  }
}
```

| Field | Rule |
| :-- | :-- |
| `animated` | `true` when `isInflight` is true; otherwise `false` |
| `data.currency` | Required on money edges (balance ↔ transaction). May omit on transaction → controller |
| `data.isInflight` | Must match the transaction’s `inflight` flag |

For multi-source or multi-destination posts, add one edge per source and per destination (same transaction node). Leave `splitSources` / `splitDestinations` empty unless you are modeling an explicit split in the tool.

## Layout convention

Place nodes so the import is readable without dragging:

| Role | Typical `x` | `y` |
| :-- | :-- | :-- |
| Source balances | `40` | stack from `40`, step ~`180` |
| Transactions | `354` | align with their row |
| Destination balances | `718` | align with their row |
| Inflight controllers | `378` | below their transaction (~`+200`) |

Separate independent flows vertically (for example deposit row, fee row, payout row). FX legs get their own rows.

## Build steps

1. Name the workflow (`name`).
2. List balances → emit `balance-node`s (`naming-patterns` for `@` names).
3. List movements → emit `transaction-node`s (set `inflight` when completion waits on other work).
4. For each inflight txn → emit a controller node pointing at that txn node id.
5. Wire edges: source → txn → destination (+ txn → controller when inflight).
6. Validate: every money edge has currency; every inflight txn has a controller edge; no dangling node ids.
7. Tell the user in chat to import the JSON at [map.blnkfinance.com](https://map.blnkfinance.com).

## Minimal example (applied P2P)

```json
{
  "name": "P2P transfer",
  "nodes": [
    {
      "id": "a1b2c3d4-e5f6-4789-a012-3456789abc01",
      "type": "balance-node",
      "position": { "x": 40, "y": 40 },
      "data": {
        "type": "balance",
        "label": "Alice wallet",
        "balance": {
          "id": "b2c3d4e5-f6a7-4890-b123-456789abcd02",
          "identifier": "Alice wallet",
          "ledgerId": "ldg_default",
          "currency": "USD",
          "type": "customer",
          "allowOverdraft": false
        },
        "validationErrors": []
      },
      "width": 162,
      "height": 103
    },
    {
      "id": "c3d4e5f6-a7b8-4901-c234-56789abcde03",
      "type": "transaction-node",
      "position": { "x": 354, "y": 50 },
      "data": {
        "type": "transaction",
        "label": "p2p-alice-bob",
        "transaction": {
          "id": "d4e5f6a7-b8c9-4012-d345-6789abcdef04",
          "amount": 50,
          "amountLocked": false,
          "currency": "USD",
          "reference": "p2p-alice-bob",
          "description": "P2P Alice to Bob",
          "inflight": false,
          "allowOverdraft": false,
          "atomic": false,
          "runAsync": false,
          "metadataSchema": [],
          "splitSources": [],
          "splitDestinations": []
        },
        "validationErrors": []
      },
      "width": 200,
      "height": 98
    },
    {
      "id": "e5f6a7b8-c9d0-4123-e456-789abcdef005",
      "type": "balance-node",
      "position": { "x": 718, "y": 40 },
      "data": {
        "type": "balance",
        "label": "Bob wallet",
        "balance": {
          "id": "f6a7b8c9-d0e1-4234-f567-89abcdef0006",
          "identifier": "Bob wallet",
          "ledgerId": "ldg_default",
          "currency": "USD",
          "type": "customer",
          "allowOverdraft": false
        },
        "validationErrors": []
      },
      "width": 162,
      "height": 103
    }
  ],
  "edges": [
    {
      "id": "a7b8c9d0-e1f2-4345-a678-9abcdef00007",
      "source": "a1b2c3d4-e5f6-4789-a012-3456789abc01",
      "target": "c3d4e5f6-a7b8-4901-c234-56789abcde03",
      "type": "workflow-edge",
      "animated": false,
      "data": { "currency": "USD", "isInflight": false }
    },
    {
      "id": "b8c9d0e1-f2a3-4456-b789-abcdef000008",
      "source": "c3d4e5f6-a7b8-4901-c234-56789abcde03",
      "target": "e5f6a7b8-c9d0-4123-e456-789abcdef005",
      "type": "workflow-edge",
      "animated": false,
      "data": { "currency": "USD", "isInflight": false }
    }
  ]
}
```

In real outputs, generate new random UUIDs for every `id` field.

## Checklist

- [ ] `name` describes the product flow
- [ ] Every map balance is a `balance-node` with correct `balance.type`
- [ ] Every movement is a `transaction-node` with currency, amount, reference
- [ ] Inflight txns have a controller + animated edges
- [ ] Edges form source → txn → destination for each leg
- [ ] `@` naming matches `naming-patterns`
- [ ] Chat reply told the user to import at map.blnkfinance.com
- [ ] Ready for [architecture-choices.md](architecture-choices.md)
