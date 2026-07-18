# Risk score rubric

Watch does **not** ship a fixed risk policy. You define what scores mean. This reference builds that policy with the user, then maps every rule onto it.

Docs: [Defining verdicts](https://docs.blnkfinance.com/watch/rules/defining-verdicts).

Ask in **plain language**, one small cluster at a time. Prefer codebase evidence (existing scores, ops runbooks) over guessing. Follow [how-to-ask.md](../../documentation/references/how-to-ask.md): for standard policy choices, propose the starter bands below and ask them to confirm.

## Why this comes after rules

You need a list of **patterns and intended severities** from [writing-rules.md](writing-rules.md) before numbers are meaningful. Rubric without patterns = arbitrary floats. Patterns without a rubric = inconsistent scores that make consolidation and webhooks noisy.

## How Watch uses scores (must teach)

1. Each matching rule contributes its `score` (omit → `0.0`) and a rule-level `verdict` + `reason`.
2. **`final_risk_score`** = average of matching rule scores, clamped to `[0, 1]`.
3. **`final_verdict`** (consolidation) is derived from that average in current Watch behavior:
   - score **≥ 0.7** → `block`
   - otherwise (when at least one rule matched) → `review`
   - no rules matched → `indeterminate` (`final_risk_score` `0.0`)
4. Individual rule verdicts (`allow`, `approve`, `alert`, `review`, `deny`, `block`) are **not merged** into `final_verdict`. They remain on `dsl_verdicts` for audit and app logic that reads per-rule outcomes.
5. Alert webhooks can use a separate floor: `ALERT_WEBHOOK_RISK_THRESHOLD` (default `0.5`). See [configuration.md](configuration.md).

Design implication: **the number on each rule is the main lever for consolidated allow/block-style outcomes.** Rule-level verdict words still matter for humans and for consumers of `dsl_verdicts`, but they must stay consistent with the score you chose.

## Decision framework

Work top-down:

```text
1. Risk appetite     → how aggressive should hard stops be?
2. Action model      → what should the app/ops do at each band?
3. Score bands       → map 0.0–1.0 to those actions
4. Consolidation     → will averages still land in the right band?
5. Webhook threshold → which scores should notify?
6. Assign per rule   → same severity → similar score
```

### Suggested starter bands (customize; do not treat as product defaults)

| Band | Score range | Typical meaning | Rule-level verdict (suggested) |
| :-- | :-- | :-- | :-- |
| Informational | `0.0`–`0.2` | Explicit allow/track; weak signal | `allow` / `approve` |
| Soft signal | `0.2`–`0.4` | Log / light notify | `alert` |
| Review | `0.4`–`0.69` | Human or secondary check | `review` / `deny` (policy) |
| Hard stop | `0.7`–`1.0` | Stop processing | `block` |

Reserve **`1.0`** for must-block patterns (sanctions-style, known-bad destination) so a **single** matching rule averages to ≥ 0.7 even alone.

### Consolidation stress test

Before locking scores, walk examples:

| Matching scores | Average | Consolidated `final_verdict` |
| :-- | :-- | :-- |
| `1.0` | `1.0` | `block` |
| `0.8` | `0.8` | `block` |
| `0.5` | `0.5` | `review` |
| `0.3` + `0.3` | `0.3` | `review` |
| `0.9` + `0.1` | `0.5` | `review` (high rule diluted!) |
| `0.6` + `0.6` + `0.6` | `0.6` | `review` |

If a hard-stop rule can co-fire with many low-score rules, either:

- keep hard-stop at `1.0` and limit how many soft rules share the same txn, or
- teach the app to also inspect `dsl_verdicts` for any `block` / high score, not only `final_verdict`.

Call this out explicitly in the rubric deliverable.

## Fill the rubric

Cover topics in this order. Skip what the codebase already answers. Prefer “I’ll use the starter bands unless you want different cutoffs” over a long score interview.

### 1. Appetite and ownership

Ask simply: “Who owns risk decisions?” “Would you rather over-review or under-block?”

Cover:

- Who owns risk policy (compliance, fraud, product, ops)
- Prefer false positives (more reviews) or false negatives (fewer blocks)
- Regulatory or partner constraints that force hard stops

**Assume and confirm:** balanced appetite; hard stops only for must-block patterns they name.

### 2. Action model

Ask simply: “When something looks risky, what should the product do?”

For each outcome, what should happen:

- Continue silently vs continue with an audit row
- Notify Slack/PagerDuty/email
- Queue for human review (and who)
- Reject / void / hold (inflight) / reverse
- Difference between “policy deny” and “fraud block” in their ops language

Map answers to Watch’s six rule verdicts where useful, knowing consolidation still keys off score.

**Assume and confirm:** soft → alert/log; mid → review queue; ≥ 0.7 → block processing.

### 3. Bands and thresholds

Ask simply: “Is the starter score table fine, or do you want different cutoffs?”

Cover:

- Score that should mean “notify me” (webhook threshold candidate)
- Score that should mean “hard stop” (must be ≥ `0.7` for consolidated `block` today)
- Wide review band vs sharp cliff into block
- Whether `1.0` stays rare (only unblockable patterns)

**Assume and confirm:** starter bands above; webhook threshold `0.5`; hard-stop rules at `1.0`.

### 4. Per-pattern severity

For each rule from the writing-rules list, confirm severity in plain language (“soft”, “review”, or “hard stop”), then assign scores. Cover co-fire / average behavior only when multiple rules can hit the same txn.

### 5. Consistency pass

- Same severity → scores within ~0.1
- No orphan scores outside the band table
- `ALERT_WEBHOOK_RISK_THRESHOLD` sits on a band boundary

## Rubric template

Fill before assigning final numbers in `.ws` files:

```text
Owner:
Appetite: prefer over-review | prefer under-block | balanced

Bands:
  0.00–0.20: meaning: …  app/ops: …  typical verdict: …
  0.20–0.40: …
  0.40–0.69: …
  0.70–1.00: …  (consolidated block band)

Hard-stop score: (e.g. 1.0)
Webhook threshold: (e.g. 0.5) — align with configuration step

Consolidation notes:
  - App reads final_verdict only? also dsl_verdicts?
  - Dilution risk when soft + hard rules co-fire: …

Rule assignments:
  - <RuleName>: score …  verdict …  band …  co-fire notes: …

Open questions:
  - …
```

## Assigning scores to rules

1. Sort rules by severity band.
2. Pick one representative score per band (e.g. soft `0.3`, review `0.5`, hard `1.0`).
3. Apply to all rules in that band; only deviate with a written reason.
4. Re-run the consolidation stress test for the top 5 real journeys.
5. Update `.ws` `score` / `then` to match.
6. Proceed to [configuration.md](configuration.md) so webhook threshold matches the rubric.

## Ready check

Only finish this step when:

- [ ] Band table exists with meanings and intended actions
- [ ] Every rule has a score inside a named band
- [ ] Hard-stop rules sit at ≥ `0.7` (usually `1.0`) if consolidated `block` is required from that rule alone
- [ ] Dilution / co-fire behavior is documented
- [ ] Webhook threshold candidate is chosen (config step will lock the env var)
