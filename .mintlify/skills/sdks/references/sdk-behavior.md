# SDK behavior

Official Blnk SDKs share the same integration rules. Language packages differ in syntax, not in when or how you may call Core.

## Supported packages

| Language | Package / artifact | Docs |
| :-- | :-- | :-- |
| TypeScript / JavaScript | `@blnkfinance/blnk-typescript` | [TypeScript SDK](https://docs.blnkfinance.com/sdks/typescript) |
| Go | `github.com/blnkfinance/blnk-go` | [Go SDK](https://docs.blnkfinance.com/sdks/go) |
| Python | `blnk-python` (`from blnk_sdk import ...`) | [Python SDK](https://docs.blnkfinance.com/sdks/python) |
| Java | `com.blnkfinance:blnk-sdk` (JDK 17+) | [blnk-java](https://github.com/blnkfinance/blnk-java) |

Install or upgrade to the **latest** published version. Pair with latest Core (`blnk-core` skill).

## Shared behavior (all SDKs)

1. **Init once.** Create a single shared client from env (`BLNK_BASE_URL`, `BLNK_API_KEY`). Do not reconstruct the client per request or paste setup into every snippet.
2. **SDK for application code.** If the language has an SDK and the method exists, call it. Never invent parallel HTTP wrappers for covered endpoints.
3. **Show only the API call in examples.** Assume `blnk` / `client` is already initialized. Link install docs for setup.
4. **Auth is the SDK’s job.** Pass the scoped API key at init; the client sends `X-blnk-key`. Do not hand-roll auth headers when using the SDK.
5. **Check success in app code.** Do not assume a resolved promise / non-nil value means business success. Inspect status / error envelopes as each SDK documents.
6. **Money fields via `blnk-precision` skill.** Prefer `precise_amount` + `precision` from your currency enum helpers. Do not invent a second unit system.
7. **Queue / inflight via domain skills.** `skip_queue`, webhooks, and holds are product decisions (`blnk-queueing`, `blnk-webhooks`, `blnk-inflight`), not SDK-specific.
8. **Confirm methods before falling back.** Check docs method pages or SDK source. If missing, use [http-fallback.md](http-fallback.md) for that gap only, and plan to switch when the method ships.
9. **No secrets in source.** Keys and base URLs come from env or a secret manager.

## Call shape by language

Use the idiomatic client surface; keep request bodies readable (one field per line).

| Language | Typical call |
| :-- | :-- |
| TypeScript | `const response = await blnk.Resource.method({ ... })` |
| Go | `result, resp, err := client.Resource.Method(...)` — always handle `err` |
| Python | `response = blnk.resource.method({ ... })` — check `status` / `data` / `error` |
| Java | `ApiResponse<T> response = blnk.resource().method(...)` — branch on `status()` / `data()` / `error()`; methods do not throw for HTTP failures |

## Common resources

Expect coverage across: ledgers, ledger balances, transactions (create, bulk, inflight commit/void, refund, get, get by reference), identities, search, reconciliation, hooks, metadata, balance monitors, API keys, system.

Exact names differ by language (PascalCase vs snake_case vs `ledgers()` accessors). Prefer the SDK’s documented resource names; do not invent aliases.

## Out of scope here

- Raw HTTP gaps → [http-fallback.md](http-fallback.md)
- Terminal exploration → [when-to-use-curl.md](when-to-use-curl.md)
