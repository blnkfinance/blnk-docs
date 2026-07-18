---
name: blnk-webhooks
description: Subscribe to Blnk webhooks and transaction hooks securely with HMAC verification and idempotent handlers. Use when handling X-Blnk-Signature, transaction.applied events, PRE/POST hooks, or keeping app state in sync after money movements on either the queued or skip_queue path.
metadata:
  author: blnk
  version: "0.2"
---

# Webhooks and events

Subscribe safely. Verify signatures. Handle events idempotently.

**Webhooks work with both queue modes.** Global events fire when ledger state changes whether you posted with `skip_queue: false` or `skip_queue: true`. Queueing chooses when the HTTP response is final; it does not turn webhooks on or off.

Pair with the `blnk-queueing` skill for per-step sync vs async. Use this skill for delivery, security, and handlers.

## Quick start

1. Configure a global webhook URL in Blnk notification settings.
2. On each request: verify `X-Blnk-Signature` + `X-Blnk-Timestamp` ([references/security.md](references/security.md)).
3. Allowlist events you need ([references/events.md](references/events.md)), especially `transaction.applied` / `transaction.rejected`.
4. Dedupe by event/transaction id, then update app state ([references/receiver.md](references/receiver.md)).

## Queue vs skip_queue

| Path | Flag | Role of webhooks |
| :-- | :-- | :-- |
| Async (queued) | `skip_queue: false` | **Primary confirmation.** Create often returns `QUEUED`. Treat applied/rejected (or poll) as the terminal signal before marking money settled in your app. |
| Sync | `skip_queue: true` | **Still delivered.** Drive the next step from the HTTP/SDK response. Use webhooks for downstream fan-out, notifications, and secondary systems that should not sit on the request path. |

Same verify + idempotent receiver for both. Do not skip webhooks (or treat them as unused) just because a step is sync.

Details on events and handlers: [references/events.md](references/events.md), [references/receiver.md](references/receiver.md). Load `blnk-queueing` for when to choose each path.

## Choose mechanism

| Mechanism | Use for |
| :-- | :-- |
| Global webhooks | System events after state changes (both queue modes) |
| Transaction hooks | PRE/POST interceptors on the request path |

Details: [references/global-vs-hooks.md](references/global-vs-hooks.md).

## Mandatory steps

1. Verify signatures → [references/security.md](references/security.md)
2. Subscribe only to needed events → [references/events.md](references/events.md)
3. Build an idempotent receiver → [references/receiver.md](references/receiver.md)
4. Match confirmation to the path:
   - **Queued:** do not treat create success as final until applied/failed events (or poll)
   - **Skip queue:** treat the response as the next-step outcome; still handle webhooks idempotently for any consumer that listens

## Hard rules

- Never process unsigned payloads.
- Never mutate your DB from webhooks without idempotency keys (event id / transaction id / reference).
- Return 2xx quickly after durable accept; do heavy work async if needed.
- Never assume webhooks only apply to `QUEUED` posts. Sync posts emit the same lifecycle events.

## Docs

- [Webhooks overview](https://docs.blnkfinance.com/webhooks/overview)
- [Global webhooks](https://docs.blnkfinance.com/webhooks/global-webhooks)
- [Transaction hooks](https://docs.blnkfinance.com/webhooks/transaction-hooks)
- [Supported events](https://docs.blnkfinance.com/webhooks/events)
