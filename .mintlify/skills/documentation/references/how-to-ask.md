# How to ask (all Blnk skills)

Use this whenever a Blnk skill needs product or ops answers from the user. The bullet lists in skill references are **topic checklists**, not scripts to read aloud.

## Style

- Ask in **plain language**. Prefer “Whose money is this?” over “Whose money is this (customer, merchant, platform, partner)?”
- Cover the **topics** in each reference. Do not paste the skill’s bullets into chat as a questionnaire.
- Ask **one small cluster** at a time (a few related questions). Do not dump a section’s full list.
- Prefer the **codebase** when it already answers. Only ask for product judgment, ops reality, or missing intent.

## Assume and confirm

For common Blnk defaults, **state your assumption first** and ask the user to confirm or correct. Do not interview every standard choice from scratch.

Examples of safe assume-and-confirm defaults (adjust when the product clearly differs):

| Topic | Reasonable default to propose |
| :-- | :-- |
| Core hosting (staging/prod) | Blnk Cloud managed, unless they already self-host or cannot use Cloud |
| Org `@` balances | Live in the General Ledger |
| Watch deployment | Cloud + embedded Watch, Git-backed `.ws` rules |
| Watch alert threshold | `0.5`, aligned with the review / soft-signal band in their rubric |
| Common fiat precision | `100` for currencies that use cents (call out zero-decimal currencies) |
| Card-style auth vs settlement | Auth sync (`skip_queue: true`); settlement/commit often async |
| Customer wallets | No overdraft unless they say otherwise |
| Map external rails | `@World{CCY}_{Rail}` style system balances |

Phrase it like: “I’ll assume X unless you want Y. Sound right?”

Only open a full interview when the answer is product-specific, high-stakes, or the default would be wrong for their flow.

## After maps

Whenever you emit maps-tool JSON, say clearly in the **chat reply** (not only in `.blnk_context/`):

> Import this JSON into [map.blnkfinance.com](https://map.blnkfinance.com) to view and edit the money movement map.

Link the file path or paste the JSON so they can download/copy it.
