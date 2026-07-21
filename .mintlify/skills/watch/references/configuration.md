# Watch configuration

Configure Watch after rules and the risk rubric exist. **Prefer Blnk Cloud with embedded Watch** over installing and operating the standalone `blnk-watch` binary. Confirm the deployment path and config sketch match ops reality. Do not paste production secrets into chat or `.blnk_context/`.

Docs: [Deploy Production License](https://docs.blnkfinance.com/cloud/start/license/start), [License configuration](https://docs.blnkfinance.com/cloud/start/license/configuration), [Configuration](https://docs.blnkfinance.com/watch/configuration), [Integration](https://docs.blnkfinance.com/watch/integration), [Commands](https://docs.blnkfinance.com/watch/commands), [Webhooks](https://docs.blnkfinance.com/watch/webhooks).

Follow [how-to-ask.md](../../documentation/references/how-to-ask.md): plain language, one cluster at a time, assume Cloud + Git + sensible alert defaults and confirm.

## Decision framework

```text
1. Deployment path  → Cloud + embedded Watch (default) vs self-host binary
2. Rule source      → Git-backed rules (Cloud default) vs local directory
3. Alerting         → enable webhooks, URL topology, risk threshold
4. Self-host only   → ingest mode, DB_URL, sync window, full .env
5. Emit config sketch → placeholders only; wire secrets in their vault
```

Lock the **risk rubric** ([risk-score-rubric.md](risk-score-rubric.md)) before setting `ALERT_WEBHOOK_RISK_THRESHOLD` so the number matches a band boundary.

## 0. Deployment path (confirm first)

The Production License stack includes **Core, Cloud Dashboard, and Watch** in one dedicated environment. You can run that stack in your own infra or in a **dedicated cloud environment managed by Blnk**. Prefer the managed Cloud path unless the user already self-hosts or cannot use Cloud.

| Path | When to recommend | What this skill configures |
| :-- | :-- | :-- |
| **Cloud + embedded Watch** (default) | Staging, production, any team that should not operate Watch/Core themselves | Git rule loading, alert webhooks, risk threshold; point at Cloud deploy docs for the stack |
| **Self-host Watch binary** | Local experiments, air-gapped, or explicit choice to run `blnk-watch` | Full `.env`: `DB_URL`, ingest, sync, rules, alerts |

**Assume and confirm:** Cloud + embedded Watch. Ask simply only if unclear: “Are you on Blnk Cloud, or do you need to run Watch yourself?” Skip a long hosting interview when Cloud is already obvious.

On the Cloud path, skip self-host ingest/`DB_URL` topics unless they also need a local evaluator for development.

**Recommend Cloud + embedded Watch** when unsure. Do not default to `curl …/install/watch` for production. Self-host binary docs remain valid for local/dev and constrained environments ([Deploy Watch](https://docs.blnkfinance.com/watch/deployment)).

---

## Confirm (Cloud + embedded Watch)

### 1. Where do rules live?

On Cloud / Production License, prefer **Git-backed** `.ws` files so rule changes are reviewable and the embedded Watch can pull them.

Ask simply: “Which repo holds the rules?” Cover branch and private-repo auth only when needed.

- Which repo and branch hold production rules
- Private repo → username + token (store token as a secret)
- Still prototyping alone locally → local `WATCH_SCRIPT_DIR` until cutover to Git

Cloud license env (see [License configuration](https://docs.blnkfinance.com/cloud/start/license/configuration)):

| Variable | Role | Default |
| :-- | :-- | :-- |
| `WATCH_SCRIPT_GIT_REPO` | Git URL containing `.ws` rules | unset |
| `WATCH_SCRIPT_GIT_BRANCH` | Branch to track | `main` |
| `WATCH_SCRIPT_GIT_USERNAME` | HTTPS clone username for private repos | `x-access-token` |
| `WATCH_SCRIPT_GIT_TOKEN` | PAT/password for private repos | unset (secret) |

Also valid on any Watch: `WATCH_SCRIPT_DIR` (local dir / clone target; default `watch_scripts`).

**Assume and confirm:** Git on `main` for shared Cloud deploys; local dir only for early solo design.

### 2. Alert webhooks

Ask simply: “Should Watch ping an HTTP endpoint when risk crosses a threshold?”

Cover:

- Enable alerts or not
- Primary URL only, or secondary + backup for failover
- Bearer token (`ALERT_WEBHOOK_API_KEY`)
- Minimum score to notify (align with the rubric)
- Disable in early sandbox (`ALERT_WEBHOOK_ENABLED=false`)

| Variable | Role | Default |
| :-- | :-- | :-- |
| `ALERT_WEBHOOK_URL` | Primary alert endpoint | unset |
| `ALERT_WEBHOOK_SECONDARY_URL` | Fallback if primary fails | unset |
| `ALERT_WEBHOOK_BACKUP_URL` | Final fallback | unset |
| `ALERT_WEBHOOK_API_KEY` | Bearer token for alert requests | unset |
| `ALERT_WEBHOOK_RISK_THRESHOLD` | Minimum score to alert | `0.5` |
| `ALERT_WEBHOOK_ENABLED` | Master switch | `true` |

**Assume and confirm:** alerts enabled in staging/prod with threshold `0.5` (or the rubric’s soft/review boundary); sandbox can start disabled. Remind: set the threshold against the rubric, not as a magic number.

### 3. Cloud prerequisites

- [ ] At least one useful rule exists before evaluating live traffic (empty rules → non-match / indeterminate)
- [ ] `meta_data` contract from writing-rules is implemented on the Core posting path
- [ ] Git auth ready when using a private rules repo
- [ ] Alert endpoint reachable from the Cloud / license environment (if enabled)

---

## Confirm (self-host binary only)

Use this section only after the user opts out of Cloud embedded Watch (or needs a local evaluator).

### 1. How do transactions enter Watch?

Ask simply: “Should Watch read Core’s database, or will something push transactions in?”

Cover:

- DB sync from Blnk Core Postgres (`blnk.transactions`) vs API inject
- Historical backfill on startup vs live traffic only

| Mode | When to recommend | Required config |
| :-- | :-- | :-- |
| **DB sync** (`start` / `sync` / `sync-once`) | Stay aligned with Core, least glue code | `DB_URL` |
| **API inject** | Watch as pure evaluator; custom pipeline already forwards txns | `DB_URL` not required for evaluation-only |

**Assume and confirm:** DB sync on self-host unless they already own an ingest pipeline or cannot share DB access.

### 2. Rule source

Same variables as Cloud; local dir is more common for laptop demos. Prefer Git once more than one person edits rules.

### 3. Sync window (DB sync only)

These do **not** change rule logic; they control where the **first** sync starts when no watermark exists yet. If both are set, `SYNC_TRANSACTION_START_TIME` wins.

| Variable | Role | Default |
| :-- | :-- | :-- |
| `SYNC_TRANSACTION_LOOKBACK` | Relative window (Go duration) | `48h` |
| `SYNC_TRANSACTION_START_TIME` | Absolute start; overrides lookback | unset |

**Assume and confirm:** `48h` lookback unless they need a specific start time.

Runtime batching/interval: CLI flags (`-sync-interval`, `-batch-size`), not env. See Commands docs when tuning load.

### 4. Alert webhooks

Same as Cloud (table above).

### 5. Self-host prerequisites

- [ ] Useful rules before connecting live Core
- [ ] `meta_data` contract on the posting path
- [ ] Host can reach Postgres (if syncing) and alert URLs (if enabled)
- [ ] Persistent volume for Watch data if deploying on ephemeral PaaS disks (`./blnk_watch_db`)
- [ ] Git auth ready (if Git rule source)

---

## Configuration brief template

```text
Deployment: cloud-embedded (preferred) | self-host-binary
Reason if self-host: …

Rule source: git:<repo>@<branch> | local:<dir>
Git auth: none | username+token (secret)
Alerts:
  enabled: true|false
  primary: <url or placeholder>
  secondary/backup: …
  risk_threshold: <from rubric>
  auth: bearer placeholder | none

# Self-host only:
Ingest: db-sync | api-inject | n/a
DB_URL: set | n/a
Sync: lookback:<duration> | start_time:<rfc3339> | n/a

Open questions:
  - …
```

## Config sketches (placeholders only)

**Cloud + embedded Watch (Git rules + alerts):**

```bash
WATCH_SCRIPT_GIT_REPO=https://github.com/your-org/watch-rules.git
WATCH_SCRIPT_GIT_BRANCH=main
WATCH_SCRIPT_GIT_USERNAME=x-access-token
WATCH_SCRIPT_GIT_TOKEN=REPLACE_ME

ALERT_WEBHOOK_ENABLED=true
ALERT_WEBHOOK_URL=https://example.com/watch/alerts
ALERT_WEBHOOK_API_KEY=REPLACE_ME
ALERT_WEBHOOK_RISK_THRESHOLD=0.5
```

Point the team at [Deploy Production License](https://docs.blnkfinance.com/cloud/start/license/start) for the stack; do not invent a parallel Watch host.

**Self-host: DB sync + local rules + alerts:**

```bash
DB_URL=postgres://USER:PASSWORD@HOST:5432/blnk?sslmode=require

WATCH_SCRIPT_DIR=watch_scripts

SYNC_TRANSACTION_LOOKBACK=48h

ALERT_WEBHOOK_ENABLED=true
ALERT_WEBHOOK_URL=https://example.com/watch/alerts
ALERT_WEBHOOK_API_KEY=REPLACE_ME
ALERT_WEBHOOK_RISK_THRESHOLD=0.5
```

**Self-host: API-only evaluator:** omit `DB_URL` and sync vars; still set rule source + alerts as needed.

## Ready check

- [ ] Deployment path chosen; Cloud preferred unless a written self-host reason exists
- [ ] Rule source (Git vs local) chosen
- [ ] `ALERT_WEBHOOK_RISK_THRESHOLD` matches the risk rubric
- [ ] Secrets called out as vault/env only (not committed)
- [ ] Self-host only: ingest/sync/`DB_URL` decided and next command path clear (`blnk-watch start` vs API inject)

## Related next steps

- Wire alert consumers → [Watch webhooks](https://docs.blnkfinance.com/watch/webhooks) (and Core `blnk-webhooks` skill only if mixing Core event hooks).
- Persist the brief with the `blnk-documentation` skill as `.blnk_context/NN_watch-configuration.md` when the team needs it.
