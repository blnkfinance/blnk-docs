# Architecture choices

Docs: [Ledger architecture](https://docs.blnkfinance.com/ledgers/architecture), [General Ledger](https://docs.blnkfinance.com/ledgers/general-ledger).

Follow [how-to-ask.md](../../documentation/references/how-to-ask.md) when checking grouping with the user. The sections below are decision topics, not a script.

## Mental model

Ledgers are folders; balances are files. How you group balances into ledgers should follow what you need to navigate, measure, and operate, not a fixed template.

There is no single correct layout. Build a repeatable grouping decision, apply it consistently, and revisit it when products or reporting needs change.

## Always keep

- **General Ledger** for organization-owned `@` balances (fees, nostro, world, funding pools).

## Repeatable process

Run this after the money movement map exists ([money-movement-map.md](money-movement-map.md)). Do not create customer balances until the ledger table is filled in.

1. **List every balance** from the map (customer nodes + `@` internals).
2. **Propose a grouping axis** from reporting needs in the context brief. Write one sentence: “We group balances by X because Y.” Prefer **assume and confirm** (for example by product/service when product reporting is the primary need).
3. **Assign each balance to a ledger** under that axis. Put all `@` org balances in the General Ledger unless the map requires a dedicated internal ledger.
4. **Stress-test** with the topics below. If answers conflict, pick the axis that matches the hardest reporting or ops need, and note the tradeoff.
5. **Freeze the rule.** New balances must follow the same sentence from step 2. Do not invent a second grouping style ad hoc.
6. **Emit the ledger table** (`ledger -> balances`) for the parent skill deliverables.

## Topics to check when grouping

Cover these in plain language before locking ledgers. Prefer short written answers in the architecture notes. Do not paste this list into chat.

### What they need to see

- What must they sum or filter in one place (AUM per product, loans receivable, fees, per-user position)?
- Which view is harder to reconstruct later if grouping is wrong: product performance or customer 360?
- Do support or finance navigate by product, customer, currency, or legal entity?

### Who owns the balance

- Customer-owned, org-owned (`@`), or temporary intermediary (escrow, settlement)?
- Should org-owned balances ever sit in a customer ledger? (**Default: no.** Use General Ledger / named `@` balances. Confirm if they push back.)

### Product and scale

- How many product lines today, and how many planned?
- Will a user typically hold balances in one service or many?
- Create balances on signup per product, or lazily when the product is used?

### Operations and risk

- Which ledger boundaries make reconciliation, audits, or access scopes simpler?
- Do high-throughput or hot balances need isolation? (Also load `queueing` → hot balances when relevant.)
- Are multi-currency or FX nostros clearer with a product ledger or in General Ledger?

### Consistency

- Can every new balance type be placed using the same one-sentence rule?
- If two teammates independently group the next balance, would they pick the same ledger?

## Common outcomes (examples, not defaults)

These are frequent answers to the process above, not required designs.

### By service (product line)

One ledger per service (Accounts, Cards, Lending). Each user’s balances for that service live in that ledger.

**Often wins when:** product reporting (AUM, loans receivable, per-service performance) is the primary need.

### By user

One ledger per user containing that user’s balances across services.

**Often wins when:** a single-user position across products is the primary need.

| Axis | Service ledgers | User ledgers |
| :-- | :-- | :-- |
| Product reporting | Easier | Harder |
| Per-user 360 view | Harder | Easier |
| Identity linking | Often one identity → many balances across ledgers | Balances colocated per user ledger |

Other axes (currency, legal entity, region) can win when the topics above point there. Document the rule the same way.

## After choosing

Create ledgers and balances in map order. Implement edges with the `transactions`, `inflight`, and `fx` skills as needed. If grouping stays ambiguous after a short confirm pass, load the `support` skill instead of inventing a hybrid.

Reuse **reporting needs** and **connected tools** from [discover-context.md](discover-context.md) when choosing the axis. Do not regroup in a way that breaks a system that already depends on a balance boundary.
