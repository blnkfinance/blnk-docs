---
name: blnk-documentation
description: Record Blnk product decisions as numbered markdown files in .blnk_context/. Use when capturing money movement maps, ledger architecture, metadata structure, naming, precision, queueing, or any other Blnk design decision for the team; when starting or updating a Blnk integration context pack.
metadata:
  author: blnk
  version: "0.4"
---

# Blnk context documentation

Persist every Blnk decision in **`.blnk_context/`** at the repo (or app) root. One decision per file. Clear, concise, numbered in the **order they are created**.

Do not bury decisions only in chat. If the team cannot open `.blnk_context/` and reconstruct the design, the documentation step is incomplete.

## Asking the user

When any Blnk skill needs product or ops answers, follow [references/how-to-ask.md](references/how-to-ask.md): plain-language questions, one cluster at a time, assume common defaults and confirm. Topic lists in skills are checklists, not chat scripts.

## Folder and naming

```text
.blnk_context/
  NN_<slug>.md
```

- `NN` = zero-padded sequence (`01`, `02`, `03`, …) in creation order
- `<slug>` = short `snake-case` topic name
- No spaces in filenames
- For a **new** topic, use the **next unused** number. Do not renumber existing files.
- For an **existing** topic, keep the same `NN_<slug>.md` (and matching `.json` if any) and update it.

The numbers are ordering only. They are **not** a fixed catalog of required filenames.

### Naming examples (not a required set)

If a team happened to decide map → architecture → metadata first, files might look like:

```text
.blnk_context/
  01_money-movement-map.md
  02_ledger-architecture.md
  03_metadata-structure.md
```

Another project might start with precision or naming and get different numbers for the same topics:

```text
.blnk_context/
  01_precision.md
  02_naming-internals.md
  03_money-movement-map.md
```

Both are correct. Match the slug to the decision; match the number to creation order.

## Topic templates

When writing a common decision type, use the matching template (then save as `NN_<slug>.md`):

| Topic | Template | Typical source skill |
| :-- | :-- | :-- |
| Money movement map | [references/money-movement-map.md](references/money-movement-map.md) | `blnk-ledger-architecture` |
| Ledger architecture | [references/ledger-architecture.md](references/ledger-architecture.md) | `blnk-ledger-architecture` |
| Metadata structure | [references/metadata-structure.md](references/metadata-structure.md) | `blnk-naming-patterns` |

Shared format: [references/format.md](references/format.md).

Other topics (precision, queueing, inflight, fx, naming internals, watch rules / risk rubric / Watch config, …) use the same format with a fitting slug. No special template required. Typical Watch slugs from the `blnk-watch` skill: `watch-rules`, `watch-risk-rubric`, `watch-configuration`.

## Workflow

1. Complete the decision with the matching domain skill (do not invent docs without the decision).
2. List `.blnk_context/` and **look for an existing file for this topic** (same slug or same decision theme, for example `*_money-movement-map.md`, `*_ledger-architecture.md`).
3. **If a related file already exists, update it in place.** Merge new balances, edges, rules, or assumptions into that file. Update the companion artifact when one exists (for example `NN_money-movement-map.json`). Do not create a second file for the same topic.
4. **Only create a new `NN_<slug>.md`** when the topic is new (no matching file). Use the next free `NN` and a descriptive `snake-case` slug.
5. Write or update using [references/format.md](references/format.md) (and a topic template when one fits). Keep it short: decisions and tables, not essays. Set **Updated** and append a **Changelog** line for every change.
6. Refresh **See also** links on the file you touched and on closely related siblings when the change affects them (for example map ↔ architecture).
7. Tell the user the path written or updated and what changed.

## Hard rules

1. One decision theme per file.
2. Concise: status, context, decision, consequences, open questions.
3. **Prefer update over create.** When the design grows (new flows, balances, metadata keys, queue choices), patch the existing related `.blnk_context/` file(s). Do not spawn duplicate numbered docs for the same topic.
4. Update in place when a decision changes; note the date under **Changelog**.
5. Never store secrets, API keys, or raw PII in `.blnk_context/`.
6. Related artifacts (for example maps-tool JSON) may sit beside the doc as `NN_<slug>.json` and be linked from the markdown. Keep the artifact number aligned with its markdown file when you update either.
