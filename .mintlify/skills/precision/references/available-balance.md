# Available balance display

Balances expose more than a single number. For spendable UX while holds exist:

```text
available ≈ balance - inflight_debit_balance
```

Also consider queued impact when using the queue (`with_queued` where supported). See the `blnk-queueing` skill.

## Rules

1. Do not show `balance` alone as spendable if inflight debits exist.
2. Convert to human units with **the same** `precisionOf(currency)` used when posting ([currency-rules.md](currency-rules.md), [amount-helpers.md](amount-helpers.md)). Never hardcode `100` in the UI.
3. Balance responses are minor-unit integers and do not include `precision`. Your app supplies the scale.
4. Document which fields your UI uses so support and eng share one definition.

## Related

- Load the `blnk-inflight` skill for hold-field semantics
- Balance fields in [balances introduction](https://docs.blnkfinance.com/balances/introduction)
