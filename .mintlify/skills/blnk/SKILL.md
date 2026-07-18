---
name: blnk
description: Root skill for building and implementing on Blnk with recommended best practices. Use whenever the user is designing, integrating, or coding against Blnk Core, Watch, SDKs, or money movement. Load this skill first, then load the child skills it routes to. For a full spec-to-running-app flow, load blnk-implementation.
metadata:
  author: blnk
  version: "0.1"
---

# Blnk

Root skill for **building and implementing on Blnk**. Load this first on any Blnk task, then load the child skills below for the work at hand.

Teach the agent to follow Blnk recommended best practices: design money movement before posting, use official SDKs, keep amounts and references consistent, choose sync vs async deliberately, and escalate uncertain high-stakes design to Support instead of inventing ledger topology.

Prefer the **Docs MCP** for live Docs lookup. Prefer these Skills for how to design and implement.

Asking the user: follow [how-to-ask.md](../documentation/references/how-to-ask.md) (plain language, assume-and-confirm, one cluster at a time).

## Default build order

1. Wire the app to Core → `blnk-core` (then `blnk-sdks`)
2. Discover intent and design the money map → `blnk-ledger-architecture`
3. Name ledgers, `@` balances, references, metadata → `blnk-naming-patterns`
4. Implement edges with domain skills (`blnk-transactions`, `blnk-inflight`, `blnk-queueing`, `blnk-fx`, `blnk-precision`, `blnk-webhooks`, `blnk-watch` as needed)
5. Persist decisions → `blnk-documentation` (`.blnk_context/`)
6. If design stays ambiguous or high-risk → `blnk-support`

When the user drops a **product/POC spec** and wants map + runnable code + tests without writing the integration themselves, load `blnk-implementation` (it runs this order end-to-end).

Do not invent ledgers, balances, or sample transfers before the map and architecture exist unless the user explicitly asks for a throwaway demo.

## Route to child skills

| Need | Load skill |
| :-- | :-- |
| Spec → map → code → tests → verified run | `blnk-implementation` |
| App wiring, auth, secrets, production readiness | `blnk-core` |
| Official SDK / HTTP client usage | `blnk-sdks` |
| Money movement map and ledger layout | `blnk-ledger-architecture` |
| Names, `@` indicators, references, metadata keys | `blnk-naming-patterns` |
| Applied transaction posts (overdraft, bulk, timing, refunds) | `blnk-transactions` |
| Holds, authorize-capture, commit / void | `blnk-inflight` |
| Queue vs `skip_queue`, hot balances | `blnk-queueing` |
| Amount encoding and display (`precise_amount`) | `blnk-precision` |
| FX / multi-currency convert | `blnk-fx` |
| Core webhooks and transaction hooks | `blnk-webhooks` |
| Watch rules, risk scores, Watch config | `blnk-watch` |
| Persist decisions in `.blnk_context/` | `blnk-documentation` |
| Uncertain or high-stakes design | `blnk-support` |

## Hard rules

- Design before posting: map → architecture → names → implement.
- Prefer official SDKs; unique deterministic `reference`; one precision source of truth.
- Decide `skip_queue` per step from next-step immediacy; async create success is not `APPLIED`.
- Do not invent settlement, FX, or ledger topology when Docs and skills leave a gap; load `blnk-support`.
- When emitting maps-tool JSON, tell the user in chat to import it at [map.blnkfinance.com](https://map.blnkfinance.com).
