# Amount helpers

## Prefer precise_amount

Send integer `precise_amount` already scaled by `precision`. Avoid the float `amount` write path in application code (15 significant-digit limit and rounding risk).

Never send `amount` and `precise_amount` together.

## One helper module

Implement convert helpers **once**, next to the currency precision enum ([currency-rules.md](currency-rules.md)). Reuse them in API handlers, jobs, migrations, and UI.

```text
precise = round(human_amount * precisionOf(currency))  # rounding policy explicit
human   = precise / precisionOf(currency)
```

### Sketch (TypeScript)

```typescript
import { Currency, precisionOf } from './currency';

type Rounding = 'half_away_from_zero' | 'floor' | 'ceil';

export function toPreciseAmount(
  humanAmount: number,
  currency: Currency,
  rounding: Rounding = 'half_away_from_zero',
): bigint {
  const precision = precisionOf(currency);
  const scaled = humanAmount * precision;
  // Implement rounding without IEEE surprises; prefer decimal libs for money input.
  return BigInt(roundWithPolicy(scaled, rounding));
}

export function toHumanAmount(preciseAmount: bigint | number, currency: Currency): number {
  const precision = precisionOf(currency);
  return Number(preciseAmount) / precision;
}

export function transactionAmountFields(humanAmount: number, currency: Currency) {
  return {
    currency,
    precision: precisionOf(currency),
    precise_amount: Number(toPreciseAmount(humanAmount, currency)),
  };
}
```

Call sites should look like `transactionAmountFields(10, Currency.USD)`, not `{ amount: 10, precision: 100 }`.

## Anti-drift rules

1. Helpers must take `currency` (or an enum) and look up precision internally.
2. Do not accept a raw `precision` argument from callers unless you are writing low-level tests.
3. Store precise integers in your own DB if you mirror amounts; do not store floats as the ledger truth.
4. For multi-source / multi-destination with `precise_amount`, use `precise_distribution` for fixed legs (see Core precision docs).
5. Log both human and precise forms when debugging; always include currency.

## Validation

- Reject negative amounts unless the product explicitly models them and overdraft rules are set.
- Reject non-integer `precise_amount`.
- Reject currencies missing from the enum map.
- Define rounding once; add tests for `.005`-style edges per currency.

## SDK

Use SDK fields that match Core (`precise_amount`, `precision`). Build request bodies through your helpers so SDK examples still go through the same precision table.
