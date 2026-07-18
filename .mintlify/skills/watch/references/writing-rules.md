# Writing clean Watch rules

Goal: every `.ws` rule is **small, named for the pattern, and useful** when it fires. Prefer many single-purpose rules over one mega-condition.

Docs: [Rule structure](https://docs.blnkfinance.com/watch/rules/rule-structure), [Setting conditions](https://docs.blnkfinance.com/watch/rules/setting-conditions).

## Discover patterns first

Do not draft rules from a one-line “add fraud checks” request. Investigate until you can list discrete **risk patterns**. Follow [how-to-ask.md](../../documentation/references/how-to-ask.md): plain language, one cluster at a time, assume common defaults and confirm. Explore the codebase for existing `meta_data`, transaction descriptions, and money flows (`ledger-architecture` context if present).

### Pattern discovery topics

Cover these in simple language. Example prompts: “What are you trying to catch?” “Which flows first: payouts, deposits, transfers?” Do not paste this list into chat.

**What they are protecting**

- Fraud / abuse, compliance, operational guardrails, promo abuse, partner SLA, or a mix
- Which journeys matter first (payouts, deposits, transfers, refunds, FX, card auth)
- Hard stops vs logging-only signals

**What signals exist on the transaction today**

- Which of `amount`, `currency`, `source`, `destination`, `description`, `reference`, `created_at` are reliable
- What is already in `meta_data` (KYC tier, channel, country, promo, partner id)
- What rules would need that is **not** on the payload yet (app contract, not invented fields)

**What “useful” means when a rule fires**

- Who reads the `reason` (ops, compliance, support, automated worker)
- Whether the rule can stand alone in an audit log without opening the `.ws` file
- Velocity / history patterns (aggregates, `previous_transaction`) vs single-txn

**Assume and confirm when reasonable:** start with the journeys already on their money map; use existing `meta_data` keys only; hard-stop only for must-block patterns they name.

Stop drafting when you can fill:

```text
Patterns:
  - <name>: when … → intended ops meaning: …
meta_data needed:
  - <key>: who sets it / when
Out of scope:
  - …
```

## Anatomy (always)

```bash RuleName.ws
rule RuleName {
  when <one focused condition>

  then <verdict>
    score <from rubric>
    reason "<specific, standalone explanation>"
}
```

| Part | Clean usage |
| :-- | :-- |
| `rule` name | camelCase or snake_case; describe the **pattern**, not the score |
| Filename | Match the pattern (`HighValueUSD.ws`, `burst_to_same_destination.ws`) |
| `when` | One goal. Prefer `and` of related filters; split independent `or` branches into new rules |
| `then` | Verdict from the rubric (after risk-score step) |
| `score` | From the shared rubric; never ad-hoc per rule without updating the rubric |
| `reason` | What matched and why it matters; never “Rule matched” or “Looks risky” |

## Hard constraints

1. **Transactions only.** Rules do not read balances, ledgers, or identities. Put needed context on `meta_data` in the app before the txn reaches Watch.
2. **Supported fields only:** `transaction_id`, `amount`, `reference`, `source`, `destination`, `description`, `created_at`, `meta_data` (plus fields you attach under `meta_data`). Use `$current.<field>` for dynamic compares.
3. **One pattern per rule.** Complex `(A and B) or (C and D) or …` → separate rules. Easier to debug, score, and disable.
4. **Watch does not fetch external data.** If the rule needs KYC country or promo code, the app must send it.
5. **Scores and verdicts come from the rubric.** If the rubric is not done, write `when` + draft `reason`, leave score assignment for [risk-score-rubric.md](risk-score-rubric.md).

## Condition toolkit (choose the simplest that works)

| Need | Prefer |
| :-- | :-- |
| Threshold / equality / list / regex on this txn | Basic + combined (`and` / `or`) conditions |
| Compare two fields on this txn | `$current.<field>` |
| Burst, velocity, spend in a window | Aggregates: `count`, `sum`, `avg`, `max`, `min` with ISO-8601 windows (`"PT30M"`, `"PT24H"`, `"P7D"`) |
| Time-of-day / weekend / calendar | Time helpers on `created_at` |
| “Did something like this happen before?” | `previous_transaction(within: "…", match: { … })` |

Keep aggregate windows and thresholds explicit in the `reason` (or keep them obvious in the rule name) so ops can trust the alert.

## Quality checklist (every rule)

- [ ] Name and filename describe the pattern
- [ ] `when` encodes **one** risk or control
- [ ] Condition uses only fields / `meta_data` the app actually sends
- [ ] No unnecessary nesting; `or` of unrelated cases split into multiple rules
- [ ] `reason` is specific and audit-ready
- [ ] Score/verdict match the shared rubric (after step 2)
- [ ] Overlap with sibling rules is intentional (multiple fires are OK; scores will average)

## Anti-patterns

| Avoid | Do instead |
| :-- | :-- |
| One rule that ORs many unrelated risks | One rule per risk |
| Vague reasons | Name the threshold, field, or pattern that fired |
| Relying on data Watch cannot see | Extend transaction `meta_data` in Core posting path |
| Encoding policy only in the verdict word | Align score with consolidation + webhook threshold (rubric) |
| Copy-pasting scores without a scale | Finish [risk-score-rubric.md](risk-score-rubric.md) first |

## After rules exist

1. List every rule → intended severity (low / medium / high / hard-stop).
2. Hand that list to [risk-score-rubric.md](risk-score-rubric.md) to assign numbers.
3. Only then finalize `then` / `score` blocks and proceed to [configuration.md](configuration.md).
