---
name: core
description: Prepare an application codebase to talk to Blnk Core (latest Core + SDKs, client, env, auth, secrets). Use when wiring Blnk into an existing app, upgrading Blnk versions, adding Blnk config or API keys, enabling secure mode expectations, or checking production readiness. Do not use this skill to implement the install quickstart or a first ledger/transfer demo.
metadata:
  author: blnk
  version: "0.2"
---

# Blnk Core

Prepare the **application codebase** so it can call Blnk safely. Do not run the Core install quickstart or invent a first ledger/transfer demo inside the app unless the user explicitly asks for that.

Core itself (Docker, Postgres, Redis, `blnk.json`) is ops setup. Point at [Getting started](https://docs.blnkfinance.com/home/install) when Core is not running yet. This skill owns the **app side**.

## Product model (read once)

| Concept | Role |
| :-- | :-- |
| Ledger | Groups related balances |
| Balance | Store of value (wallet, account, `@` org balance) |
| Transaction | Moves value from source to destination |
| Identity | Optional customer record linked to balances |

Balances change only through transactions. You cannot set a balance amount directly.

## Prep workflow

1. **Use the latest Blnk**
   - Target the **latest Blnk Core** release for new setups and upgrades. Check [Blnk Core changelog](https://docs.blnkfinance.com/changelog/blnk-core) and [Getting started](https://docs.blnkfinance.com/home/install) / [Deploy](https://docs.blnkfinance.com/home/deploy) for current images and tags. Prefer `latest` or the newest semver tag; do not pin an old Core without a written reason.
   - Pair app clients with **current official SDKs** (load the `sdks` skill). Install/upgrade to the newest published package versions unless compatibility requires otherwise.
   - If the repo already runs an older Core or SDK, call that out and recommend upgrading before building new ledger paths. Note breaking changes via changelogs / migration guides (for example [0.15.0 migration](https://docs.blnkfinance.com/changelog/v15-migration) when relevant).

2. **Confirm Core is reachable**
   - Need a local or cloud instance? Link [Getting started](https://docs.blnkfinance.com/home/install) / [Deploy](https://docs.blnkfinance.com/home/deploy). Do not paste the full install guide into the repo.
   - Record `baseUrl` (default local: `http://localhost:5001`).

3. **Auth expectations**
   - Prefer secure mode: `server.secure` + master key only for admin ([Secure your Blnk server](https://docs.blnkfinance.com/advanced/secure-blnk)).
   - App services use a **scoped API key**, not the master key ([API keys](https://docs.blnkfinance.com/api-keys/overview)).
   - Every request sends `X-blnk-key` (SDKs set this from the key you pass at init).

4. **Wire the app**
   - Load the `sdks` skill. Add the official SDK when the language has one (latest version).
   - Add env (never commit secrets): e.g. `BLNK_BASE_URL`, `BLNK_API_KEY` (scoped key).
   - Create a single shared client module (init once). No keys in source, no ad-hoc HTTP clients when an SDK exists.

5. **Stop here for money movement**
   - Do not create ledgers, balances, or sample transfers as part of "setup" unless asked.
   - Next: `ledger-architecture` (map) → `naming-patterns` → `integration-patterns` or domain skills → implement via `sdks`.

## Hard rules

- Setup and upgrades target **latest Blnk Core** and **current SDKs** unless the user documents a temporary pin.
- Scoped keys in app code; master key only for key admin / local bootstrap.
- Secrets in env or a secret manager, never in git.
- One shared Blnk client; prefer SDKs (`sdks` skill).
- Unique `reference` and consistent `precision` when you later post transactions (`precision` skill).
- HTTP 2xx on a queued post is not `APPLIED` (`queueing`, `webhooks`).

## Before shipping

Open [references/production-readiness.md](references/production-readiness.md).

## Route to other skills

| Need | Load skill |
| :-- | :-- |
| SDK / HTTP client usage | `sdks` |
| Names, `@` indicators, references | `naming-patterns` |
| Ledger layout / money map | `ledger-architecture` |
| Product recipes (wallet, escrow) | `integration-patterns` |
| Queue vs `skip_queue` | `queueing` |
| Holds / authorize-capture | `inflight` |
| Applied transaction APIs | `transactions` |
| FX / multi-currency convert | `fx` |
| Webhook receivers | `webhooks` |
| Uncertain / high-risk design | `support` |
| Persist decisions in `.blnk_context/` | `documentation` |
