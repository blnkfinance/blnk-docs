---
name: blnk-implement
description: Integrates Blnk for a specific task or workflow. Recommends the latest Core first, reviews the repo against upgrade guides, then chooses inflight vs applied, sync vs async, split vs bulk, and events vs an instant response. Use when writing or reviewing Blnk integration code, posting transactions, committing or voiding holds, wiring webhooks, or implementing a deposit, payout, transfer, refund, or similar workflow.
metadata:
  author: blnk
  version: "1.2"
---

# Implement

How to integrate Blnk for this task. You are deciding how this call should land, not touring the product.

- Follow `blnk` for lookup and asking. Fetch the page for this Core version before you write the call.
- A map is useful when one exists. It is not required. If there is no map, read the repo and the ask. Ask only for the context this task still needs.
- Load `blnk-design` only when the money movement itself is still unclear. Do not stop a concrete directive ("commit this hold", "make this deposit sync") to force a map.

The ledger is the source of truth. Money events start there. Balances are derived from posts.

## The loop

- **See the task.** What must be true when you are done? A deposit credited, a hold captured, a payout submitted, a refund posted. Prefer the codebase. If they already have balances and a flow, use those. Do not invent a second product to look complete.
- **Upgrade first.** Recommend the latest Core before you change how they post. Detect what they run. Fetch [Upgrade Core](https://docs.blnkfinance.com/changelog/upgrade). Review their code against every migration guide between that version and latest, and say what would break. Then implement against the latest behaviour. [references/version.md](references/version.md).
- **Decide the call.** Answer these yourself. Ask only when you cannot. [references/decide.md](references/decide.md).
  - Is this movement finished, or is other work still outstanding?
  - After this call returns, does the next step already need the ledger result? That choice also decides how you look the record up later.
  - Is this one economic event that splits, or many independent posts?
  - How is the amount stored so it stays consistent?
  - Is this the same business operation as last time?
  - Can this source go negative?
- **Post.** Official SDK when it covers the language and the endpoint. Fetch [Create transaction](https://docs.blnkfinance.com/reference/create-transaction). Do not send `status`. Blnk sets it.
- **Confirm the way this call confirms.** Instant response, or event / poll. Lookup follows the same choice. `QUEUED`, HTTP 200, or SDK success is not proof the money applied unless this call was sync and the body says so. A Blnk webhook is how you hear the ledger moved. A rail webhook is not.
- **Tie the journey.** Legs that belong to one order, deposit, or payout share a metadata key. Use the same `reference` you sent to the bank or chain when you can.

## You are done when

- You recommended latest, named the version they run, and showed what in their code the upgrade guides would break.
- You can say whether the movement is finished, whether the next step needed the result now, how you confirmed it, and how you look that record up on this path.
- The handler matches that choice: it reads the response and the exact `reference` when the call is sync, or it waits for the event and follows the queued parent / `_q` when the call is queued.

If you cannot, you are not done.

## Failure modes

- Forcing a map before answering a concrete integration question
- Inventing balances or a movement this task does not need
- Encoding the money rules in the app, then writing the ledger second
- Implementing on an old Core without recommending latest, or skipping the upgrade-guide review of their code
- Assuming today's queue default on an older Core, or yesterday's sync commit on 0.15+
- Treating `QUEUED` or a rail webhook as applied
- Looking up a queued post by the original `reference` and expecting `APPLIED`, or appending `_q` on a sync post
- Sending `status` on create (`APPLIED` + `inflight: true` is not a combination)
- One `skip_queue` for the whole product
- Using bulk to fake a split, or a split to post unrelated intents
- A new `reference` after a timeout
- Inflight for a transfer that already lives entirely inside the ledger
- Leaving a hold with no commit, void, or expiry
- Voiding a payout hold because the bank timed out
- Both `amount` and `precise_amount` on the same write
