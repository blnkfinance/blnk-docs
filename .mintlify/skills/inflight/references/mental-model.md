# Inflight mental model

## What inflight is

Inflight is for movements that are **not done yet**. Other things must happen before you mark the movement complete (commit) or abandon it (void).

While that work is in progress, Blnk **holds** value against balances without finally applying it. Available funds decrease by the held debit until you commit or void.

Typical UI math for spendable funds:

```text
available ≈ balance - inflight_debit_balance
```

(Exact field names: see balance responses in the docs. Load the `precision` skill for available-balance display rules.)

## Inflight vs QUEUED

| Concept | Meaning |
| :-- | :-- |
| `QUEUED` | Transaction is waiting to be processed by workers (async pipeline) |
| Inflight | Business incomplete: reserved until commit (done) or void (not done) |

A transaction can be queued and also be an inflight hold. Do not use one word for both.

## When to use inflight

Use inflight whenever completion depends on something outside the single post, for example:

- Card-style authorize, then capture when the charge is confirmed
- Escrow until delivery, match, or dispute resolution
- Payout review, then send or cancel
- Order-book: reserve into escrow until match (load the `fx` skill)
- Any flow where partner confirmation, compliance check, or multi-step settlement must finish first

## When not to use inflight

- Simple deposits, withdrawals, or P2P that are final when posted (nothing else must happen)
- “Maybe retry later” without a real incomplete hold (use unique references + queue instead)

## Lifecycle sketch

```text
create(inflight: true) → INFLIGHT
        │
        │  other work happens
        │  (auth, delivery, match, review, …)
        │
        ├─ commit (full or partial) → movement complete
        └─ void → movement not complete; release hold
```

Use `inflight_expiry_date` (or scheduled void) so abandoned holds do not stick forever.
