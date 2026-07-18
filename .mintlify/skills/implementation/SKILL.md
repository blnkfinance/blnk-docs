---
name: blnk-implementation
description: Turn a product or POC spec into a money movement map plus runnable Blnk app code, tests, and a verified run. Use when the user drops a spec, PRD, or POC doc and wants end-to-end implementation without writing the code themselves.
metadata:
  author: blnk
  version: "0.1"
---

# Implementation

Orchestrate Blnk Skills so a **spec in** becomes a **map + running app out**. The user answers plain-language questions; you write the map, code, and tests.

Trigger when the user provides (or points at) a product/POC spec (for example a wallet) and wants you to implement it on Blnk.

Follow [how-to-ask.md](../documentation/references/how-to-ask.md): plain language, one cluster at a time, assume common defaults and confirm. Prefer the Docs MCP for live Docs lookup.

## Success criteria

When this skill finishes, the user should have:

1. A money movement map (maps-tool JSON) and chat guidance to import it at [map.blnkfinance.com](https://map.blnkfinance.com)
2. `.blnk_context/` decision docs for the map and ledger architecture
3. App code that creates ledgers/balances and posts the mapped flows via official SDKs
4. Automated tests for the happy path (and key failure paths from the spec)
5. A verified local (or agreed) run against a reachable Core

They should not have to write the Blnk integration code themselves.

## Pipeline (mandatory order)

Do not skip ahead to code before the map and architecture exist.

### 1. Ingest the spec

- Read the attached or linked spec fully.
- Extract: product type, money owners, happy paths, currencies, rails/processors, holds/settlement, out of scope.
- List gaps as open questions. Ask only what the spec does not answer.
- **Assume and confirm** stack defaults unless the repo or user already chose:
  - Language: TypeScript + official Blnk TS SDK when the repo is TS/JS or unspecified
  - Core: `http://localhost:5001` for local POC, or their Cloud URL if they already have one
  - Customer wallets: no overdraft
  - Org `@` balances in the General Ledger

Stop and load `blnk-support` if the spec is financially high-risk and still ambiguous after one confirm pass.

### 2. Design (map first)

Load and complete, in order:

1. `blnk-ledger-architecture` (discover from the spec → money movement map → maps-tool JSON → ledger table)
2. `blnk-naming-patterns` while labeling nodes and references
3. `blnk-documentation` → persist `.blnk_context/NN_money-movement-map.md` (+ JSON) and `.blnk_context/NN_ledger-architecture.md`

In the chat reply after the map JSON: tell the user to import it at [map.blnkfinance.com](https://map.blnkfinance.com).

Pause briefly for map confirmation (“Does this map match your spec?”) before generating app code. If they correct the map, update JSON + `.blnk_context/` first.

### 3. Wire Core and SDKs

Load `blnk-core` then `blnk-sdks`:

- Env for base URL and scoped API key (never commit secrets)
- Shared client init
- Confirm Core is reachable before creating resources

### 4. Implement the flows

From the map edges, load only the domain skills you need:

| Edge need | Load |
| :-- | :-- |
| Applied posts | `blnk-transactions` |
| Holds / settle later | `blnk-inflight` |
| Sync vs async | `blnk-queueing` |
| Amounts | `blnk-precision` |
| FX | `blnk-fx` |
| Lifecycle webhooks | `blnk-webhooks` |
| Risk rules (only if the spec asks) | `blnk-watch` |

Generate application code that:

- Creates ledgers and balances in map order
- Posts each mapped movement with unique deterministic `reference`s and correct `precision`
- Sets `skip_queue` / `inflight` per the map decisions
- Exposes a thin runnable entry (script, CLI, or minimal API) so the POC can be exercised without the user writing glue

Prefer official SDK methods. Keep the POC scoped to what the spec covers; do not invent unrelated products.

### 5. Tests

Add automated tests that:

- Cover each happy-path journey from the map
- Cover important failure/refund paths the spec includes (skip if the map marked them out of scope)
- Use real Core when available, or clearly document a skip if Core is unreachable
- Assert terminal ledger outcomes (not only HTTP 2xx on queued creates)

### 6. Run and verify

1. Install dependencies.
2. Run tests.
3. Run the POC entrypoint against Core (create resources + exercise happy path).
4. Report what ran, what passed, and how to repeat it.
5. If something fails, fix and re-run; do not hand back a broken POC as done.

## Deliverables checklist

- [ ] Spec ingested; assumptions confirmed
- [ ] Maps-tool JSON emitted; user told to import at map.blnkfinance.com
- [ ] `.blnk_context/` map + architecture docs written
- [ ] App wired (`blnk-core` + `blnk-sdks`)
- [ ] Mapped flows implemented in code
- [ ] Tests written and run
- [ ] Happy path verified against Core
- [ ] Short handoff: how to import the map, how to run the app/tests, env vars needed

## Hard rules

1. **Map before code.** No ledgers, balances, or sample transfers until map JSON + architecture docs exist.
2. **Spec is source of truth.** Do not expand scope beyond the spec without asking.
3. **User writes answers, not Blnk code.** You own implementation, tests, and the run.
4. **Official SDKs** for supported languages and endpoints (`blnk-sdks`).
5. **Secrets stay in env.** Never commit API keys.
6. Queued create success is not `APPLIED` (`blnk-queueing`, `blnk-webhooks`).
7. Escalation: load `blnk-support` when design stays contested or high-risk.

## Anti-patterns

- Jumping straight to wallet CRUD without a money movement map
- One giant interview before reading the spec
- Shipping code with no tests or no verified run
- Inventing FX, Watch, or refunds the spec did not ask for
- Treating the map as optional documentation instead of the implementation blueprint
