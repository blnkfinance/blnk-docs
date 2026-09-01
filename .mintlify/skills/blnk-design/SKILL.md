---
name: blnk-design
description: Designs a Blnk money movement map as a clickable map.blnkfinance.com link, and a ledger architecture that groups balances. Use when the product has no map yet, when structuring ledgers or balances, or when the user asks how a wallet, deposit, payout, FX, hold, or identity should sit on the ledger.
metadata:
  author: blnk
  version: "1.0"
---

# Design

See the money before you post. Two outputs, in this order:

- **Map:** how money moves. A clickable [map.blnkfinance.com](https://map.blnkfinance.com) link, not a prose diagram.
- **Architecture:** how those balances are grouped into ledgers so the team can find and roll them up.

There is no one correct ledger. There is a map you can open, and a grouping you can defend.

- Follow `blnk` for lookup and asking. Fetch pages. Do not copy them into the chat as a questionnaire.

## The loop

- **Describe the product** in the user's words. Read the spec and the repo first. Ask only what those do not answer.
- **See each movement.** For every flow, answer these yourself. Ask the user only when you cannot:
  - Whose money is this?
  - What comes in, what goes out, what stays inside the system?
  - Is this movement finished, or is other work still outstanding?
  - What still sits with a rail, a bank, or "outside"?
  - Is any of this a fee, a spread, a split, or another currency?
- **Build the map.** Balances are nodes. Movements are edges. Every edge has a source and a destination, and a single direction.
  - Fetch [Money movement map](https://docs.blnkfinance.com/ledgers/money-movement-map).
  - "Outside" is an internal balance, not a missing node. Fetch [Internal balances](https://docs.blnkfinance.com/balances/internal-balances) when you need the current conventions.
  - Write the JSON in [references/map-json.md](references/map-json.md). Run `scripts/shorten-map-url.mjs` and put the short URL in chat so they can click it and see the map.
- **Then group.** This is the architecture. Ledgers are folders. Group balances by what this team must report and find.
  - Fetch [Ledger architecture](https://docs.blnkfinance.com/ledgers/architecture) and [Designing your ledger architecture](https://www.blnkfinance.com/blog/designing-your-ledger-architecture-with-blnk-a-step-by-step-guide).
  - Group by product, location, or function, whichever matches how they query and roll up.
  - Do not create a ledger per customer. Link a customer's balances to one identity. Fetch [Identities](https://docs.blnkfinance.com/identities/introduction).
  - Organization-owned internals (`@` balances, fees, rails, revenue) live in the General Ledger.
  - Show a ledger → balances table and say why you grouped that way.
  - If two groupings are both plausible, show both and offer Support (`blnk`).
- **Share both, then wait.** Put the map link and the grouping in chat, in their product's words. Do not create ledgers or post until they confirm. Then build, using live docs for the call itself.

## You are done seeing when

- They can click a link and see the map on [map.blnkfinance.com](https://map.blnkfinance.com).
- You can say, for each flow: who it belongs to, where it comes from, where it goes, whether it is finished, and what still sits with a rail.
- You can say which ledger each balance sits in, and what that grouping lets them report.
- If you cannot, you are not done. Do not create ledgers to look complete.

## Failure modes

- Wallet CRUD, then a transfer, called a design
- A mermaid or ASCII sketch treated as the map (the map is the link)
- Inventing balances "for completeness" that no movement uses
- Treating `@` internal balances as customer wallets
- One ledger per customer instead of identities
- Circular or two-way edges that hide who pays whom
- Grouping ledgers before the map exists
- Building because they asked, without showing the map and architecture first
- Posting before the map and the grouping can be defended
