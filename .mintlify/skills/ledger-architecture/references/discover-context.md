# Discover context for the money movement map

Do not draft a map from a one-line product pitch. Investigate until you can explain **what money does**, **who cares about the numbers**, **what systems touch the ledger**, and **what else must happen around each movement**.

Follow [how-to-ask.md](../../documentation/references/how-to-ask.md): plain language, one cluster at a time, assume common defaults and confirm. The bullets below are **topics to cover**, not a questionnaire to paste into chat. If the codebase can answer, explore it instead of asking.

Escalate with the `support` skill when the product intent stays ambiguous after investigation.

## Goal of discovery

Produce a short **context brief** that feeds [money-movement-map.md](money-movement-map.md). Stop discovery only when each section below has enough signal to name balances and edges without guessing.

## 1. Intent

Understand what they are building and why money moves. Ask simply, for example: “What product is this for?” “Whose money moves?” “When is a payment ‘done’?”

Cover:

- Product or workflow (wallet, marketplace, cards, lending, FX, payroll, …)
- Who owns the money (customer, merchant, platform, partner)
- Happy-path journeys where value changes hands
- What must be true for a movement to be **complete** (load `inflight` when completion waits on other work)
- Failure, refund, chargeback, clawback, or reversal paths that matter
- What is out of scope for this map

**Assume and confirm when reasonable:** customer-facing wallets with no overdraft; refunds/chargebacks out of scope unless they mention them.

## 2. Reporting needs

The map must support how they will measure and explain balances later ([architecture-choices.md](architecture-choices.md) depends on this). Ask simply, for example: “What do finance or ops need to see every week?”

Cover:

- Daily/weekly views (AUM, fees, float, payables, receivables, per-merchant liability)
- Whether product-line, per-customer, per-currency, or per-legal-entity views come first
- Liability vs asset vs P&L from their point of view
- Who reconciles, and against which external statement (bank, processor, chain, partner)
- Regulatory or partner reporting that constrains how balances are split

**Assume and confirm when reasonable:** liability on customer wallets; fees and float tracked on org `@` balances; primary grouping driven by their hardest reporting need (often product line).

## 3. Technical constraints

Capture limits that change nodes, edges, or timing. Ask simply, for example: “Which currencies?” “Does settlement happen right away or later?”

Cover:

- Currencies and precision (load `precision` when multi-currency or subunits matter)
- Instant vs delayed settlement; multi-day or multi-hop rails (load `fx` when exchange is involved)
- Throughput / hot balances (load `queueing` → hot-balances when volume is high)
- Queue vs synchronous needs (load `queueing`)
- Overdraft policy, holds, authorize-capture, escrow
- Idempotency / reference strategy they already use
- Existing Blnk ledgers, balances, or transactions that must be preserved

**Assume and confirm when reasonable:** `precision: 100` for common cent-based fiat; unique deterministic references; no overdraft on customer wallets; card-style auth sync / settlement async when the flow looks like authorize-then-capture.

## 4. Connected tools relying on the ledger

Anything that reads or writes money state is a stakeholder of the map. Ask simply, for example: “What processors or banks move money in or out?”

Cover:

- Payment processors, banks, card networks, PSPs, crypto rails
- KYC/KYB, risk, fraud, or compliance systems that gate movements
- Billing, invoicing, ERP, or accounting exports
- Wallets, card issuing, lending, or other product services in the monorepo
- Webhooks, workers, or internal APIs that assume certain balance names or statuses (load `webhooks` when event-driven)
- Blnk Cloud, dashboards, or custom apps that display balances
- Partner settlements or marketplace split recipients

For each tool, note: **reads ledger**, **writes ledger**, or **both**, and which journeys it touches.

**Assume and confirm when reasonable:** list only tools already named in the repo or conversation; do not invent a full integrations inventory.

## 5. Operational workflows

Map edges often hide human or async ops steps. Ask simply, for example: “Who confirms payouts?” “Any manual review before money moves?”

Cover:

- Funding, top-ups, payouts, and how ops confirms them
- Manual review, compliance holds, or dual-control approvals
- Reconciliation cadence and break handling
- Customer support adjustments, goodwill credits, write-offs
- Month-end, fee harvesting, spread recognition, or treasury sweeps
- Incident playbooks (stuck queues, failed webhooks, hanging inflights)
- Who can commit/void inflight, reverse, or refund in production

**Assume and confirm when reasonable:** automated happy path with ops only on exceptions, unless they describe a review-heavy process.

## Context brief template

Fill this before drawing nodes. Incomplete briefs mean more discovery, not a speculative map.

```text
Intent:
  Product:
  Money owners:
  Happy paths:
  Completion depends on:
  Failures / refunds:
  Out of scope:

Reporting:
  Primary views:
  Liability / asset / P&L notes:
  Reconciliation targets:
  Regulatory / partner needs:

Technical constraints:
  Currencies / precision:
  Settlement timing:
  Queue / inflight / overdraft:
  Throughput notes:
  Existing ledger state:

Connected tools:
  - <tool>: read|write|both - journeys: …

Operational workflows:
  - <workflow>: how it affects movements: …

Open questions:
  - …
```

## Ready check

Only proceed to [money-movement-map.md](money-movement-map.md) when:

- [ ] Happy paths and completion criteria are explicit
- [ ] Reporting priorities are known enough to group balances later
- [ ] Connected tools that move or display money are listed
- [ ] Ops workflows that gate or reverse money are listed
- [ ] Open questions are either answered or parked with the `support` skill
