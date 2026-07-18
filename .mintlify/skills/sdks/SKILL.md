---
name: sdks
description: Use official Blnk SDKs (TypeScript, Go, Python, and Java) with shared client behavior; fall back to HTTP only when no Blnk SDK covers the language or endpoint. Use when initializing Blnk clients, calling ledger APIs from apps, or choosing between SDK and raw HTTP.
metadata:
  author: blnk
  version: "0.3"
---

# SDKs

## Hard rule

1. If a Blnk SDK exists for the language **and** implements the endpoint → **use the SDK**. Never invent `fetch` / `axios` / raw `http.Client` / `requests` wrappers for those calls.
2. Raw HTTP is allowed **only when**:
   - no Blnk SDK exists for that language yet, or
   - the specific endpoint is not implemented in the SDK yet
3. cURL is fine for one-off exploration and docs. Application code follows the rule above.

## Workflow

1. Detect language and any existing Blnk client in the repo.
2. **Install or upgrade to the latest SDK** for that language. Do not add an outdated package when a newer official version exists.
3. Open [references/sdk-behavior.md](references/sdk-behavior.md) and follow the shared behavior rules (init once, env secrets, success checks, precision, fallbacks).
4. Confirm the method exists (docs method pages or SDK source) before writing HTTP.
5. If the endpoint is missing → [references/http-fallback.md](references/http-fallback.md). For terminal exploration only → [references/when-to-use-curl.md](references/when-to-use-curl.md).
6. Pair with the `precision` and `queueing` skills for real posts. Ensure Core itself is latest via the `core` skill.

## Quick start (TypeScript)

```typescript
const response = await blnk.Ledgers.create({
  name: 'Customer wallets',
});
```

Assume `blnk` is already initialized. Behavior and other languages: [references/sdk-behavior.md](references/sdk-behavior.md).

## Install docs

- [SDKs overview](https://docs.blnkfinance.com/home/sdks)
- [TypeScript SDK](https://docs.blnkfinance.com/sdks/typescript)
- [Go SDK](https://docs.blnkfinance.com/sdks/go)
- [Python SDK](https://docs.blnkfinance.com/sdks/python)
- [Java SDK (GitHub)](https://github.com/blnkfinance/blnk-java)
