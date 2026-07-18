---
name: ledger-architecture
description: Investigate product intent and design Blnk money movement maps (including maps-tool JSON) and ledger architecture before coding balances and transactions. Use when structuring ledgers, discovering reporting needs or connected tools, drawing fund flows, exporting map.blnkfinance.com JSON, grouping balances into ledgers, or planning General Ledger @ balances.
metadata:
  author: blnk
  version: "0.3"
---

# Ledger architecture

Investigate deeply, then map, then architecture. Docs require a [money movement map](https://docs.blnkfinance.com/ledgers/money-movement-map) before [ledger architecture](https://docs.blnkfinance.com/ledgers/architecture).

Do not invent a map from a thin prompt. Load [references/discover-context.md](references/discover-context.md) first and build a context brief (intent, reporting, constraints, connected tools, ops workflows). Explore the codebase when it can answer; ask the user when it cannot.

## Quick start

1. Open [references/discover-context.md](references/discover-context.md) and fill the context brief.
2. Open [references/money-movement-map.md](references/money-movement-map.md) and list balances + movements from that brief.
3. Load the `naming-patterns` skill while labeling `@` internals.
4. Open [references/map-tool-json.md](references/map-tool-json.md), emit importable JSON, and ask the team to import it into the maps tool.
5. Open [references/architecture-choices.md](references/architecture-choices.md) and run the balance-grouping process (questions → ledger table).
6. Emit the deliverables below before writing API calls.
7. Load the `documentation` skill and write `.blnk_context/NN_money-movement-map.md` and `.blnk_context/NN_ledger-architecture.md` using the next free numbers.

## Mandatory order

1. Open [references/discover-context.md](references/discover-context.md) and complete discovery (ready check).
2. Open [references/money-movement-map.md](references/money-movement-map.md) and produce the map plan.
3. Load the `naming-patterns` skill while labeling nodes.
4. Open [references/map-tool-json.md](references/map-tool-json.md) and emit maps-tool JSON for import.
5. Open [references/architecture-choices.md](references/architecture-choices.md) and run the balance-grouping process.
6. Emit deliverables below.
7. Load the `documentation` skill and persist money-movement-map + ledger-architecture decision docs under `.blnk_context/` (next free `NN_<slug>.md`).
8. Hand off contested edges → `queueing`; hold edges → `inflight`; product recipes → `integration-patterns`. If intent stays ambiguous, load `support`.

## Deliverables

```text
Context brief: (from discover-context.md)
Map summary: <plain-language flow>
Maps-tool JSON: <file or fenced json for import into map.blnkfinance.com>
Nodes (balances): ...
Edges (txn types): ...
@ internals: ...
Ledger table: ledger -> balances
Queue vs skip_queue per contested edge: ...
Inflight edges: ...
.blnk_context/: NN_money-movement-map.md, NN_ledger-architecture.md
```

Do not create balances or post transactions until the context brief, map JSON, ledger table, and `.blnk_context` decision docs exist.
