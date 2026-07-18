# Decision doc format

Every file in `.blnk_context/` uses this shape. Keep sections short. Prefer tables and bullets over prose.

Filename: `NN_<slug>.md` (number = creation order, slug = topic).

```markdown
# <Title>

Status: proposed | accepted | superseded
Updated: YYYY-MM-DD

## Context
Why this decision was needed (3–6 lines max).

## Decision
What we chose. Be concrete (names, tables, rules).

## Consequences
What follows for implementation, reporting, and ops.

## Open questions
- …

## Changelog
- YYYY-MM-DD: …

## See also
- <other NN_slug.md files that exist>
```

## Writing rules

- Title matches the decision, not only the filename slug.
- **Decision** is the source of truth; do not leave the real choice only in Context.
- Use the same vocabulary as the money movement map and `blnk-naming-patterns` skill.
- **Update existing files when the topic already has a doc.** New additions (balances, edges, rules) go into that file’s Decision tables and Changelog. Create a new `NN_` only for a new topic.
- If superseded, set Status to `superseded` and point to the replacement file. Do not delete numbered files.
- Link maps-tool JSON, diagrams, or extras as relative paths under `.blnk_context/`. When the markdown updates, update the linked artifact in the same change when it is out of date.
