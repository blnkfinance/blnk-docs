# Transaction reference naming

`reference` must be unique. Duplicates are rejected or discarded depending on the path (queued vs skip-queue / bulk). Treat references as **idempotency keys**, not display labels.

Docs: [Get transaction by reference](https://docs.blnkfinance.com/reference/get-transaction-by-reference), [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions).

## General conventions

1. **Unique forever** for a given Blnk instance. Never recycle a reference for a different money movement.
2. **Generate in your app before the API call** so retries send the same value.
3. **Prefix by intent** so logs and support can scan flows: `deposit_`, `payout_`, `hold_`, `fx_`, `order_`, `fee_`, `refund_`, `migrate_`.
4. **Keep it readable and machine-safe:** lowercase, `snake_case` segments, no spaces, no secrets, avoid raw PII.
5. **One business event → one reference** (or one reference per leg; see deterministic recipes below).
6. Document prefixes on the naming sheet so every service uses the same spellings.

### Shape

```text
<intent>_<stable_id>[_<leg_or_qualifier>]
```

| Part | Role |
| :-- | :-- |
| `intent` | What kind of movement (`deposit`, `payout`, `blnk-fx`, `hold`) |
| `stable_id` | Business or provider id that will not change on retry |
| `leg_or_qualifier` | Optional: currency leg, fee leg, commit step, migration tag |

Examples:

| Reference | Why |
| :-- | :-- |
| `deposit_pi_3NxyzStripe` | Stripe PaymentIntent id, prefixed by intent + provider |
| `payout_ord_a91c2e3f_bank` | Order id + rail qualifier |
| `hold_auth_9f8e7d6c` | Card auth hold |
| `fx_ord_a91c2e3f_usd` / `fx_ord_a91c2e3f_gbp` | Same order, two currency legs |
| `fee_ord_a91c2e3f_platform` | Fee leg tied to the same order |
| `migrate_2024_legacy_txn_10042` | Imported historical id |

### External systems

- Prefer the provider’s globally unique id when one exists (`stripe_pi_...`, `paypal_cap_...`).
- Always add your intent prefix if the raw provider id alone is ambiguous across rails.
- If the provider id is only unique per merchant or per day, compose further (merchant + provider id) so Blnk uniqueness holds.

### Migrations

- Preserve the original id: `migrate_<source>_<original_id>` or `migration_<year>_<original_reference>`.
- Do not drop the migration prefix; you need to tell imports apart from live traffic.

## Clean deterministic references

A **great** reference is clean (easy to read and grep) and **deterministic** (the same business intent always produces the same string). Random UUIDs on every HTTP attempt break idempotency.

### Determinism rule

```text
same logical money movement + same generator inputs  →  same reference
new logical money movement                         →  new reference
```

Build the reference from **stable inputs you already trust** (order id, payment intent id, transfer id, auth code). Do not include:

- Wall-clock timestamps (unless the business event is literally “run at this instant”)
- Random UUIDs generated per request / per retry
- Worker hostnames, pod names, or attempt counters (unless you intentionally mean a new movement)
- Mutable status fields (`pending`, `retry2`)

### Recipe

1. Pick the **intent prefix** from your naming sheet.
2. Pick the **canonical business key** for this movement (what support would search for).
3. If one business event posts multiple Blnk transactions, add a **fixed leg qualifier** (`usd`, `gbp`, `fee`, `spread`, `commit` is wrong here; commit uses the inflight APIs).
4. Join with `_`. Lowercase. Strip spaces and unsafe characters.
5. Persist or derive the reference **before** calling Blnk; retries reuse it.
6. On failure, **look up by reference** before minting a new one.

### Multi-leg and multi-day flows

When FX or settlement uses separate transactions (see the `blnk-fx` skill), keep a shared business stem and vary only the leg:

```text
fx_ord_a91c2e3f_usd
fx_ord_a91c2e3f_gbp
fx_ord_a91c2e3f_spread_gbp
```

Correlate legs in flat `meta_data` too (`order_id`), but **uniqueness still comes from `reference`**.

### Good vs bad

| Good (deterministic) | Bad |
| :-- | :-- |
| `deposit_pi_3Nxyz` | `deposit_` + `uuid()` on every retry |
| `payout_ord_a91c_bank` | `payout_1710000000` (timestamp) |
| `fx_ord_a91c_usd` | `fx_ord_a91c_usd_retry3` |
| `hold_auth_9f8e7d6c` | `hold_john_doe_card` (PII, unstable) |

### Generator checklist

- [ ] Prefix listed on the naming sheet
- [ ] Built only from stable business / provider ids
- [ ] Same retry path yields the identical string
- [ ] Multi-leg flows share a stem and differ by fixed qualifiers
- [ ] No spaces, no secrets, no PII
- [ ] Failed calls: get-by-reference before creating a new reference

## Lookups and ops

Use get-by-reference when reconciling client retries. Keep prefixes consistent across services so ops can grep ledgers and logs.

For bulk paths, read duplicate-reference behavior in [Bulk transactions](https://docs.blnkfinance.com/transactions/bulk-transactions).
