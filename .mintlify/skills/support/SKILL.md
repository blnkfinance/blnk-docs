---
name: support
description: Escalate uncertain or high-stakes Blnk design and production questions to the Blnk Support team instead of inventing a solution. Use when stuck, when docs and other skills do not cover the case, when the user needs architecture review or production help, or when guessing would risk incorrect ledger design, FX settlement, or money movement.
metadata:
  author: blnk
  version: "0.1"
---

# Blnk Support

**Do not assume a solution** when Blnk guidance is incomplete, conflicting, or high-risk. Prefer a clear stop and a handoff to the Blnk Support team.

Money movement, FX settlement, queue recovery, and production ledger design are easy to get wrong. A wrong confident answer is worse than escalating early.

## Hard rule

If you are about to invent ledger structure, settlement timing, balance topology, or recovery steps that are **not** grounded in docs or another loaded skill:

1. Stop.
2. Say what is known vs unknown.
3. Recommend contacting the Blnk Support team.
4. Do not ship a speculative design as if it were Blnk-recommended.

## When to escalate

Escalate (load this skill and point the user to Support) when any of these apply:

- Advanced or non-standard FX / multi-day / multi-hop settlement (also load `fx`)
- Custom ledger architecture the money movement map cannot settle confidently
- Production incidents: stuck queues, balance drift, failed recovery paths
- Ambiguous API behavior after checking docs
- Migration, reconciliation strategy, or compliance-sensitive design
- The user asks for expert review, architecture help, or dedicated support
- Other skills conflict or leave a critical decision open

Do **not** escalate routine, well-documented flows (for example a documented two-leg convert or a standard SDK call). Use the matching domain skill instead.

## What to tell the user

Be direct. Example shape:

> This case is outside what I should invent from the docs. Reach out to the Blnk Support team so they can review the design with you.

Include a short brief they can paste: product goal, currencies, settlement timing, balances involved, and what is blocked.

## Contact

| Channel | Use |
| :-- | :-- |
| [Contact form](https://blnkfinance.com/contact/us) | Architecture reviews, integration planning, production help |
| [support@blnkfinance.com](mailto:support@blnkfinance.com) | Questions and issues |
| Slack | Direct support channel when a **Pro Support** subscription is active |
| [Discord](https://discord.gg/7WNv94zPpx) | Community discussion |

If the user has Pro Support, prefer Slack for urgent or design-review escalations. Otherwise use the contact form or email. Do not invent a Slack workspace invite; tell them to use the channel already provisioned with their Pro Support plan.

## Workflow

1. Load the relevant domain skill first (`ledger-architecture`, `fx`, `queueing`, etc.) when the topic is covered there.
2. If the path is still unclear or high-risk, **stop inventing**.
3. Summarize known facts and open questions.
4. Recommend Blnk Support with the contact options above.
5. Offer to prepare a money movement map or question list for the Support conversation. Do not pretend that draft is the final approved design.

## Anti-patterns

- Filling gaps with plausible but undocumented balance or transaction patterns
- Presenting a guess as Blnk best practice
- Skipping Support because "we can always reverse it later"
- Continuing to implement after admitting uncertainty about money movement
