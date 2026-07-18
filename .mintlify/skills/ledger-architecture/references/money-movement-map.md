# Money movement map

Docs: [Money movement map](https://docs.blnkfinance.com/ledgers/money-movement-map). Interactive tool: [map.blnkfinance.com](https://map.blnkfinance.com).

## Why

The map is the blueprint for ledger implementation, reporting, and stakeholder alignment. It is not a developer-only sketch.

**Prerequisite:** complete [discover-context.md](discover-context.md). The map is only as good as the intent, reporting needs, constraints, connected tools, and ops workflows you captured.

**Final map artifact:** importable JSON for the maps tool. Open [map-tool-json.md](map-tool-json.md), emit the JSON, and in the **chat reply** tell the user to import it at [map.blnkfinance.com](https://map.blnkfinance.com).

## Principles

1. **Double-entry:** every movement has a source and a destination (balances).
2. **Uni-directional clarity:** money moves in a clear direction on the diagram (no ambiguous loops in the explanation).
3. **Context-backed:** every node and edge should trace to something in the context brief (a journey, report, tool, or ops step). Drop speculative edges.

## Build steps

1. Confirm the context brief ready check in [discover-context.md](discover-context.md).
2. Describe the product money flow in plain steps from **Intent** (deposit, P2P, fee, payout, FX, …), including failure/refund paths that belong on this map.
3. List **balances** (nodes) and **transaction types** (edges), including whether each edge is applied or inflight (use **completion depends on** + ops workflows).
4. Fold in **connected tools**: pay-in/pay-out rails, partner splits, and systems that must see specific balances or statuses.
5. Collapse many customers into one “customer” node when explaining the pattern; expand to per-user balances in architecture.
6. Introduce `@` internal balances for “outside” and org accounts (`@PayIn`, `@PayOut`, `@World`, nostro, fees). Load the `blnk-naming-patterns` skill.
7. Add fees, rails, and multi-leg paths as separate movements. Respect **technical constraints** (settlement timing, FX, queue, precision).
8. Open [map-tool-json.md](map-tool-json.md) and generate the maps-tool JSON (`name`, `nodes`, `edges`).
9. In the chat reply, tell the user to import the JSON at [map.blnkfinance.com](https://map.blnkfinance.com) (link the file or include the JSON).
10. Continue to [architecture-choices.md](architecture-choices.md) using **reporting needs** from the brief.

## Output checklist

- [ ] Context brief complete (intent, reporting, constraints, tools, ops)
- [ ] Every movement has source, destination, currency, and whether it is applied vs inflight
- [ ] External world and connected rails represented with `@` or named balances
- [ ] Naming matches the `blnk-naming-patterns` skill
- [ ] Maps-tool JSON produced via [map-tool-json.md](map-tool-json.md)
- [ ] Chat reply told the user to import the JSON at map.blnkfinance.com
- [ ] Ready for [architecture-choices.md](architecture-choices.md)
