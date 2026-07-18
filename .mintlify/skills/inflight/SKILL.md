---
name: inflight
description: Mental model and workflows for Blnk inflight transactions when other work must finish before a movement is complete. Use when authorizing then capturing, escrow holds, commit or void inflight, inflight expiry, split inflight, or bulk commit/void.
metadata:
  author: blnk
  version: "0.2"
---

# Inflight

Use inflight when a money movement is **not complete yet**: other steps must succeed (or fail) before you mark it done. Inflight reserves funds until then. It is not the same as `QUEUED` (async processing). Always open the mental model before coding.

## Quick start

1. Open [references/mental-model.md](references/mental-model.md).
2. Create with `inflight: true` and a unique `reference`.
3. After the external or business steps finish: commit (full/partial) or void. Never leave holds hanging.
4. Choose `skip_queue` **per call** with the `queueing` skill (auth may need sync; commit/void often async).
5. For authorize-capture or escrow, also read [references/commit-void.md](references/commit-void.md).

## Do you need a hold?

| Need | Action |
| :-- | :-- |
| Movement waits on other work before it is complete | Stay on this skill |
| Final same-currency transfer with nothing left to wait on | Use the `transactions` skill |

## Workflow

1. Create inflight (`inflight: true`) with a unique `reference`.
2. Do the other work (authorization, delivery, match, review, partner confirmation, etc.).
3. Commit (full or partial) when the movement is complete, or void when it is not.
4. Plan expiry or scheduled void so abandoned holds do not hang forever.
5. Multi-leg holds: [references/split-and-bulk.md](references/split-and-bulk.md).
6. Commit/void details: [references/commit-void.md](references/commit-void.md).

Queue vs `skip_queue` still follows the `queueing` skill.

For order-book FX escrow, also load the `fx` skill.

## Verification

- Check inflight credit/debit fields on balances while held.
- Confirm commit or void landed.
- No hanging inflights in failure paths (see dual-write notes in commit-void).

## Docs

- [Create inflight](https://docs.blnkfinance.com/transactions/inflight/creating-inflight)
- [Commit and void](https://docs.blnkfinance.com/transactions/inflight/updating-inflight)
- [Split inflight](https://docs.blnkfinance.com/transactions/inflight/split-inflight)
- [Bulk commit and void](https://docs.blnkfinance.com/transactions/inflight/bulk-update-inflight)
