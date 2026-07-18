# Discover context for the money movement map

Do not draft a map from a one-line product pitch. Investigate until you can explain **what money does**, **who cares about the numbers**, **what systems touch the ledger**, and **what else must happen around each movement**.

If the codebase can answer a question, explore it instead of asking. Ask the user when the answer is product or business judgment. Ask one focused cluster at a time; do not dump the whole list.

Escalate with the `support` skill when the product intent stays ambiguous after investigation.

## Goal of discovery

Produce a short **context brief** that feeds [money-movement-map.md](money-movement-map.md). Stop discovery only when each section below has enough signal to name balances and edges without guessing.

## 1. Intent

Understand what they are building and why money moves.

- What product or workflow are you mapping (wallet, marketplace, cards, lending, FX, payroll, …)?
- Whose money is this (customer, merchant, platform, partner)?
- What are the happy-path journeys where value changes hands?
- What must be true for a movement to be considered **complete**? (Load `inflight` when completion waits on other work.)
- What failure, refund, chargeback, clawback, or reversal paths matter?
- What is explicitly out of scope for this map?

## 2. Reporting needs

The map must support how they will measure and explain balances later ([architecture-choices.md](architecture-choices.md) depends on this).

- What must finance, ops, or product report daily/weekly (AUM, fees, float, payables, receivables, per-merchant liability)?
- Do they need product-line views, per-customer 360, per-currency, or per-legal-entity first?
- Which balances are liability vs asset vs P&L from their point of view?
- Who audits or reconciles, and against what external statement (bank, processor, chain, partner)?
- Any regulatory or partner reporting that constrains how balances are split?

## 3. Technical constraints

Capture limits that change nodes, edges, or timing.

- Currencies and precision expectations (load `precision` when multi-currency or subunits matter)
- Instant vs delayed settlement; multi-day or multi-hop rails (load `fx` when exchange is involved)
- Throughput / hot balances (load the `queueing` skill → hot-balances when volume is high)
- Queue vs synchronous needs (load `queueing`)
- Overdraft policy, holds, authorize-capture, escrow
- Idempotency / reference strategy they already use
- Existing Blnk ledgers, balances, or transactions that must be preserved

## 4. Connected tools relying on the ledger

Anything that reads or writes money state is a stakeholder of the map.

- Payment processors, banks, card networks, PSPs, crypto rails
- KYC/KYB, risk, fraud, or compliance systems that gate movements
- Billing, invoicing, ERP, or accounting exports
- Wallets, card issuing, lending, or other product services in the monorepo
- Webhooks, workers, or internal APIs that assume certain balance names or statuses (load `webhooks` when event-driven)
- Blnk Cloud, dashboards, or custom apps that display balances
- Partner settlements or marketplace split recipients

For each tool, note: **reads ledger**, **writes ledger**, or **both**, and which journeys it touches.

## 5. Operational workflows

Map edges often hide human or async ops steps.

- Funding, top-ups, payouts, and how ops confirms them
- Manual review, compliance holds, or dual-control approvals
- Reconciliation cadence and break handling
- Customer support adjustments, goodwill credits, write-offs
- Month-end, fee harvesting, spread recognition, or treasury sweeps
- Incident playbooks (stuck queues, failed webhooks, hanging inflights)
- Who can commit/void inflight, reverse, or refund in production

## Context brief template

Fill this before drawing nodes. Incomplete briefs mean more questions, not a speculative map.

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
  - <tool>: read|write|both — journeys: …

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
