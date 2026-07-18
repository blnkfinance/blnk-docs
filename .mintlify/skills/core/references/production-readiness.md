# Production readiness

Use this checklist before calling a Blnk Core integration production-ready.

## Security

- [ ] `server.secure` enabled with a strong `server.secret_key`
- [ ] Master key not used by app services in production
- [ ] Each service uses a **scoped API key** with minimal scopes ([API keys](https://docs.blnkfinance.com/api-keys/overview), [scopes](https://docs.blnkfinance.com/api-keys/scopes))
- [ ] Secrets only in env / secret manager, never in source

See [Secure your Blnk server](https://docs.blnkfinance.com/advanced/secure-blnk).

## Deploy and config

- [ ] Deployment path chosen deliberately: **Blnk Cloud managed** ([managed instances](https://docs.blnkfinance.com/cloud/instances/deploy)) or **self-host** ([deploy](https://docs.blnkfinance.com/home/deploy)). Prefer Cloud when the team should not operate Core infra themselves.
- [ ] Running **latest Blnk Core** (or newest approved release); see [Blnk Core changelog](https://docs.blnkfinance.com/changelog/blnk-core)
- [ ] App SDKs are current official releases (`blnk-sdks` skill)
- [ ] If self-hosting: Postgres and Redis URLs are production-grade (TLS, auth, backups); config reviewed ([configuration overview](https://docs.blnkfinance.com/advanced/configuration/overview)); backup path configured ([backup](https://docs.blnkfinance.com/advanced/configuration/backup))
- [ ] If on Blnk Cloud managed: instance is connected, Core URL and scoped keys taken from the Cloud dashboard, not from a local `blnk.json`

## Money movement choices (deliberate)

- [ ] Queue vs `skip_queue` decided via the `blnk-queueing` skill (not defaulted blindly)
- [ ] If queued: webhooks (or reliable polling) wired and signatures verified (`blnk-webhooks` skill)
- [ ] Precision strategy documented per currency (`blnk-precision` skill)
- [ ] Inflight holds always committed or voided (`blnk-inflight` skill)
- [ ] Multi-currency / FX uses nostro legs, not deprecated `rate` (`blnk-fx` skill)

## Hot path

- [ ] If any balance is high-throughput: completed `blnk-queueing` → [hot-balances](../../queueing/references/hot-balances.md) (queue, coalescing, sharding, hot-lane as needed)

## Observability and recovery

- [ ] Health and monitoring in place ([monitoring](https://docs.blnkfinance.com/advanced/monitoring))
- [ ] Team knows how to handle stuck queues ([queue recovery](https://docs.blnkfinance.com/advanced/queue-recovery))

## Final verification

- [ ] Unique references on every write path
- [ ] Scoped keys cannot overreach (no unnecessary `*:*`)
- [ ] Webhook handlers are idempotent
- [ ] No hanging inflight transactions in happy or failure paths
- [ ] Application code uses Blnk SDKs where available (`blnk-sdks` skill)
