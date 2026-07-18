# Overdraft

Docs: [Overdrafts](https://docs.blnkfinance.com/transactions/overdrafts), [Negative balances](https://docs.blnkfinance.com/guides/negative-balances).

`allow_overdraft: true` lets the **source** go negative for that post. Default mindset for customer spendable wallets: **off**.

## When to enable

| Enable overdraft | Why |
| :-- | :-- |
| Org `@` faces that represent external rails (`@World*`, funding pools) | Incoming/outgoing world legs often need the org balance to move before float lands |
| Explicit credit / negative-balance products | Product allows the customer to go negative by policy |
| Controlled treasury sweeps where negative is temporary and monitored | Ops accepts and reconciles the negative |

## When to keep off

| Keep overdraft off | Why |
| :-- | :-- |
| Customer wallets that must not spend more than available | Insufficient funds should fail the post |
| “Fix” a missing funding leg | Fund the source (or use inflight) instead of papering over with overdraft |
| Fee sinks / revenue balances as **source** unless designed to go negative | Usually you credit fees; debits need a funded source |

## Rules

1. Decide per **balance role**, not globally for the app. Same journey can overdraft `@WorldUSD_Stripe` and refuse overdraft on the customer wallet.
2. Do not use overdraft to hide race conditions; that is a `blnk-queueing` / funding design problem.
3. If the movement is not complete until something else happens, prefer `blnk-inflight` over letting spendable go negative accidentally.
4. Document which balances may overdraft in `.blnk_context/` / the naming sheet.

## Checklist

- [ ] Source balance role allows negatives by product policy
- [ ] Failure mode without overdraft is acceptable (or funding path exists)
- [ ] Monitoring / reconciliation knows negatives can appear on that balance
