# Currency rules

Docs: [Precision](https://docs.blnkfinance.com/transactions/precision), [Multi-currency balances](https://docs.blnkfinance.com/balances/introduction#multi-currency-balances).

## How to choose precision

1. Find the smallest unit of the asset (USD cent, BTC satoshi, ETH wei).
2. Multiply that unit until you get `1`. That multiplier is `precision`.
3. Store that value in your shared currency table. Do not recalculate ad hoc at call sites.

| Asset | Smallest unit | Precision |
| :-- | :-- | --: |
| Many fiat (USD, EUR, …) | 0.01 | `100` |
| Zero-decimal fiat (map explicitly) | 1 | `1` |
| BTC | 1e-8 | `100000000` |
| ETH (wei-style) | 1e-18 | `1000000000000000000` |

Many fiat currencies use `precision: 100`. Do not assume every ISO code is cents. Provider zero-decimal currencies must be listed explicitly.

**It is fine to use a different precision per currency.** The map is currency → precision (for example USD `100`, JPY `1`, BTC `100000000`). What you must not do is use two different precisions for the **same** currency across services.

## Source of truth (no drift)

Precision drift happens when one service posts USD with `100` and another with `1`, or when UI divides by a different scale than writers use.

**Prefer a typed enum / constant map in code** as the single source of truth. Import it everywhere (API, jobs, scripts, UI formatters).

| Approach | Use? |
| :-- | :-- |
| Enum / typed const map in a shared package | **Yes (default)** |
| Generated from the same module for all languages in a monorepo | Yes |
| Env vars (`PRECISION_USD=100`) | Avoid for the map; easy to drift across deploys and languages |
| Magic numbers at each call site (`precision: 100`) | Never |
| “Remembered” values in Notion / Slack only | Never as the runtime source |

Why enums over env:

- Reviewed in PRs with the code that posts money
- Impossible to typo a missing env in one worker
- Same value in tests, local, and production without config sync
- Autocomplete and exhaustiveness checks when you add a currency

Env remains fine for `BLNK_BASE_URL` and API keys, not for currency scale.

### Example shape (TypeScript)

```typescript
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
}

/** Single source of truth. Import this; do not redefine elsewhere. */
export const CURRENCY_PRECISION = {
  [Currency.USD]: 100,
  [Currency.EUR]: 100,
  [Currency.GBP]: 100,
  [Currency.BTC]: 100_000_000,
} as const satisfies Record<Currency, number>;

export function precisionOf(currency: Currency): number {
  return CURRENCY_PRECISION[currency];
}
```

### Example shape (Go)

```go
type Currency string

const (
  CurrencyUSD Currency = "USD"
  CurrencyEUR Currency = "EUR"
  CurrencyBTC Currency = "BTC"
)

var currencyPrecision = map[Currency]int64{
  CurrencyUSD: 100,
  CurrencyEUR: 100,
  CurrencyBTC: 100_000_000,
}

func PrecisionOf(c Currency) (int64, error) {
  p, ok := currencyPrecision[c]
  if !ok {
    return 0, fmt.Errorf("unknown currency: %s", c)
  }
  return p, nil
}
```

Reject unknown currencies. Do not default to `100`.

## Consistency rules

- Different currencies → different precisions is normal and correct.
- Never mix different precisions for the **same** currency in one product.
- Every writer (HTTP handlers, workers, migrations, scripts) must call `precisionOf(currency)`.
- UI and statements must divide with the same function.
- Name per-currency `@` balances when needed (`@RevenueUSD`), per the `blnk-naming-patterns` skill (`@<Purpose><Currency>_<Source>`).

## Multi-currency / crypto + fiat

When asset precisions differ, follow Blnk guidance: standardize on the **highest** precision used in the ledger when mixing currencies that require a shared scale, and convert rates carefully. Load the `blnk-fx` skill for exchange legs.

Document the product decision in the architecture / naming sheet:

```text
Precision strategy: per-currency table | highest-precision ledger
Table owner module: <path>
Currencies: USD=100, EUR=100, BTC=100000000, ...
```

## Checklist

- [ ] Currency → precision table exists as enums / typed constants
- [ ] No call site hardcodes precision literals
- [ ] Env is not the source of truth for the map
- [ ] Unknown currencies fail closed
- [ ] All writers and display paths import the same module
- [ ] Tests cover round-trip convert per currency
- [ ] Multi-currency / crypto strategy documented if applicable
