---
name: blnk
description: Looks up live Blnk docs, starts from the money movement map and ledger architecture, and refuses to invent money movement or API details. Use when the user is designing, integrating, building, or coding against Blnk, or mentions Blnk, ledgers, balances, transactions, inflight, webhooks, or reconciliation.
metadata:
  author: blnk
  version: "1.0"
---

# Blnk

How to work. Not a product tour.

- Look it up. Do not invent.
- Map and architecture first. Load `blnk-design` before you create or post.

## Best practices

- **See the money before you build.** Start from the map (how money moves) and the architecture (how those balances are grouped). A Core you can reach is not a design.
- **If they ask you to build** and there is no map and architecture yet, stop. Do not scaffold ledgers, balances, or a first transfer. Load `blnk-design`. Explain the map and the grouping in their product's words. Wait until they confirm. Then build.
- If a map and grouping already exist (repo, prior chat, a map link), use those. Do not invent a new one to look complete.
- When you build, each post is an edge on the map. If a flow is missing, go back to design. Do not invent a movement to keep coding.

## Quick start

- When they need a Core they can call, default to **Blnk Cloud**.
- Sign up, deploy a managed sandbox, use the instance URL and key.
- Fetch [Getting started](https://docs.blnkfinance.com/home/install) (Managed hosting) and [Managed instances](https://docs.blnkfinance.com/cloud/instances/deploy).
- Point them at [cloud.blnkfinance.com](https://cloud.blnkfinance.com) to create the workspace.
- Offer self-host only when they already have a running Core, or they explicitly ask for it. Fetch the Self-hosted tab on the same Getting started page.
- Do not mention Docker or `localhost:5001` otherwise.
- A reachable Core is not a ledger design. Do not create sample ledgers or post a first transfer as "setup." Load `blnk-design`.

## Look it up

- Use the connected Blnk Docs MCP (`https://docs.blnkfinance.com/mcp`). Search for the concept, then read the page.
- Do not answer paths, fields, statuses, error codes, or SDK methods from memory.
- If MCP is unavailable, find the page in [llms.txt](https://docs.blnkfinance.com/llms.txt) and fetch it.
- If you still cannot verify, say so, do not invent, and offer Support.
- When an official SDK covers the language and the endpoint, use the SDK. Fetch [SDKs](https://docs.blnkfinance.com/home/sdks). Do not invent an HTTP client.

## Invariants

These stay true regardless of product:

- Every post has a unique, stable `reference`. Retry the same business operation with the same reference. Do not mint a new one because a call timed out.
- `QUEUED`, HTTP 200, or SDK success is not proof the money applied. Resolve the lifecycle. Fetch [Transaction lifecycle](https://docs.blnkfinance.com/transactions/transaction-lifecycle).
- Applied, committed, and voided transactions are immutable. Corrections are new posts (refund, void, adjustment). Do not rewrite history.
- A timeout after you may have submitted to a bank or processor is **unknown**, not failed. Look the operation up by the same reference. Do not void a hold or send a second payout to "fix" it.
- Blnk owns ledger balances and transaction history. The rail owns settlement. The app owns customers and operation records. None of the three may impersonate the others.
- Do not invent ledgers, balances, or sample transfers when the money movement is still unclear. Load `blnk-design`.

## Ask

- Ask in plain language. One small cluster at a time.
- Prefer the codebase when it already answers.
- When a default is obvious for this product, state it and ask them to confirm.
- Do not interview from a script. Do not paste this skill at the user.

## When it is not one answer

- If a fact is unverified (path, field, status, SDK method), say so. Do not invent it. Offer Support.
- If the choice is subjective, or more than one design is plausible, show both. Say what each is good for. Do not present one as the Blnk-recommended answer unless a page says so. Offer Support.
- Support is [support@blnkfinance.com](mailto:support@blnkfinance.com) for questions and issues, or [Pro Support](https://blnkfinance.com/contact/us) for architecture and production help.
