# Hot balances

Docs: [Handling hot balances](https://docs.blnkfinance.com/guides/hot-balances), [Concurrency](https://docs.blnkfinance.com/guides/concurrency).

Use after the `queueing` skill has chosen **sync vs async** from next-step immediacy. Hot balances are a contention problem to solve on top of that choice.

## Hot patterns

1. **A → N:** one source funds many destinations concurrently
2. **N → A:** many sources fund one destination concurrently
3. **A ↔ B:** two balances exchange concurrently

## Levers by path

| Lever | Async (`skip_queue: false`) | Sync (`skip_queue: true`) |
| :-- | :-- | :-- |
| Coalescing | Yes | No |
| Hot-lane routing | Yes | No |
| Lock wait timeout | Yes | Yes (**first** under contention) |
| Reference-safe lock retries | Yes | Yes (**second**, on failure) |
| Balance sharding | Yes | Yes (**last**, after user interview) |
| App single-flight / serialize writers | Yes | Yes |

For **sync + high contention**, escalate in that order in [skip-queue-path.md](skip-queue-path.md). Do not propose sharding until lock wait and retries are in place (or proven insufficient) and the user has been interviewed.

## Config

- [Queue config](https://docs.blnkfinance.com/advanced/configuration/queue)
- [Transaction config](https://docs.blnkfinance.com/advanced/configuration/transactions) (coalescing, lock wait timeout)

## Anti-patterns

- Sync on a contested funding pool with no shard / lock-wait / retry plan
- One global `@Fees*` or treasury balance with unbounded concurrency and no sharding plan
- Expecting coalescing or hot-lane to fix sync contention
- Ignoring webhooks on async while assuming every create is applied
