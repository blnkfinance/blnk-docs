# Sections

Steer list copied from `blnkfinance/blnk-docs` `docs.json`. A chunk is one group under a tab, or one group under a menu item. Dropdowns belong to that group. Paths are the file ids under `src/content`, without `.mdx`.

## Core source icon `layers`

### Start Here

- `index`
- `home/install`
- `home/deploy`
- `home/llms`
- dropdown **Use cases** source icon `lightbulb`
  - `tutorials/quick-start/wallet-management`
  - `tutorials/quick-start/escrow-payments`
  - `tutorials/quick-start/savings-application`
  - `tutorials/quick-start/loyalty-points`
  - `tutorials/digital-banking/deposits-withdrawals`
  - `tutorials/digital-banking/cards`
  - `tutorials/digital-banking/lending`
  - `tutorials/digital-banking/currency-exchange`
  - `tutorials/more/ai-billing`
  - `tutorials/more/order-exchange`
- `home/sdks`
- `home/cli`
- `changelog/blnk-core`

### Ledgers

- `ledgers/introduction`
- `ledgers/general-ledger`
- `ledgers/money-movement-map`
- `ledgers/architecture`

### Ledger balances

- `balances/introduction`
- `balances/internal-balances`
- `balances/balance-monitoring`
- `balances/balance-snapshots`
- `balances/historical-balances`
- `balances/balance-from-source`

### Transactions

- `transactions/introduction`
- `transactions/dry-run`
- `transactions/transaction-lifecycle`
- `transactions/parent-transactions`
- `transactions/precision`
- `transactions/overdrafts`
- dropdown **Inflight** source icon `plane`
  - `transactions/inflight/creating-inflight`
  - `transactions/inflight/updating-inflight`
  - `transactions/inflight/bulk-update-inflight`
  - `transactions/inflight/split-inflight`
- `transactions/refunds`
- `transactions/scheduling`
- `transactions/multiple-sources`
- `transactions/multiple-destinations`
- `transactions/bulk-transactions`
- `transactions/backdated-transactions`
- `transactions/lineage`
- `transactions/hash`

### Reconciliation

- `reconciliations/overview`
- `reconciliations/external-data`
- `reconciliations/matching-rules`
- `reconciliations/strategies`
- `reconciliations/practice-example`

### Identities

- `identities/introduction`
- `identities/link-balances`
- `identities/pii-tokenization`

### Metadata

- `metadata/overview`
- `metadata/create-metadata`
- `metadata/update-metadata`

### Search

- dropdown **Using Direct DB** source icon `database`
  - `search/db/filtering`
  - `search/db/performance`
  - `search/db/examples`
- dropdown **Using Typesense** source icon `search`
  - `search/typesense/introduction`
  - `search/typesense/querying`
  - `search/typesense/filtering`
  - `search/typesense/faceting`
  - `search/typesense/sorting`
  - `search/typesense/pagination`
  - `search/typesense/joins`
  - `search/typesense/reindex`

### Webhooks

- `webhooks/overview`
- `webhooks/global-webhooks`
- `webhooks/transaction-hooks`
- `webhooks/events`

### API keys

- `api-keys/overview`
- `api-keys/scopes`
- `api-keys/owner-context`
- `api-keys/manage-keys`

### Guides

- `guides/double-entry`
- `guides/negative-balances`
- `guides/concurrency`
- `guides/hot-balances`
- `guides/insufficient-funds`
- `guides/adjusting-balances`
- `guides/closing-balances`
- `guides/migration`

### Configuration

- `advanced/configuration/overview`
- `advanced/configuration/server-security`
- `advanced/configuration/data-stores`
- `advanced/configuration/transactions`
- `advanced/configuration/queue`
- `advanced/configuration/reconciliations`
- `advanced/configuration/webhooks`
- `advanced/configuration/observability`
- `advanced/configuration/backup`
- `advanced/configuration/reference`

### Advanced

- `advanced/balance-reconstruction`
- `advanced/secure-blnk`
- `advanced/enable-https`
- `advanced/error-codes`
- `advanced/monitoring`
- `advanced/metrics-reference`
- `advanced/monitoring-port`
- `advanced/benchmarks`
- `advanced/load-testing`
- `advanced/backup-disk`
- `advanced/backup-s3`
- `advanced/queue-recovery`

### Migration guides

- `changelog/upgrade`
- `changelog/v15-4-migration`
- `changelog/v15-1-migration`
- `changelog/v15-migration`
- `changelog/v14-3-migration`
- `changelog/v14-migration`
- `changelog/v13-2-migration`
- `changelog/v12-migration`
- `changelog/v11-migration`
- `changelog/v10-5-migration`

## Cloud source icon `cloud`

### Start Here

- `cloud/index`
- `cloud/start/guide`
- dropdown **Enterprise license** source icon `badge-check`
  - `cloud/start/license/start`
  - `cloud/start/license/configuration`
- `cloud/start/definitions`
- `cloud/start/shortcuts`
- `changelog/blnk-cloud`

### Instances

- `cloud/instances/deploy`
- `cloud/instances/create`
- `cloud/instances/migration`
- `cloud/instances/whitelist`

### Ledgers

- `cloud/ledgers/overview`
- `cloud/ledgers/general-ledger`
- `cloud/ledgers/details`

### Balances

- `cloud/balances/overview`
- `cloud/balances/details`
- `cloud/balances/assign-identities`
- `cloud/balances/flag-balance`
- `cloud/balances/historical`

### Transactions

- `cloud/transactions/overview`
- `cloud/transactions/details`
- `cloud/transactions/inflight-transactions`
- `cloud/transactions/refund-transaction`
- `cloud/transactions/flag-transaction`
- `cloud/transactions/fund-lineage`

### Identities

- `cloud/identities/overview`
- `cloud/identities/details`
- `cloud/identities/pii`

### Reconciliation

- `cloud/reconciliation/overview`
- `cloud/reconciliation/external-data`
- `cloud/reconciliation/matching-rules`
- `cloud/reconciliation/strategy`

### Filters & Views

- `cloud/filters/add-filters`
- `cloud/filters/custom-views`

### Alerts

- `cloud/alerts/overview`
- `cloud/alerts/description`
- `cloud/alerts/alert-statuses`

### Monitoring

- `cloud/monitoring/overview`

### Insights

- `cloud/insights/overview`
- `cloud/insights/lake`
- `cloud/insights/queries`
- `cloud/insights/schema`
- `cloud/insights/templates`

### Apps

- `cloud/apps/overview`
- `cloud/apps/how-apps-work`
- `cloud/apps/install-app`
- dropdown **Build apps** source icon `blocks`
  - `cloud/apps/define-workflow`
  - `cloud/apps/codebase-setup`
  - `cloud/apps/register-app`
  - `cloud/apps/installation`
  - `cloud/apps/app-logic`
  - `cloud/apps/launch-app`
- `cloud/apps/best-practices`

### Settings

- `cloud/account/profile`
- `cloud/account/security`
- `cloud/account/notifications`
- `cloud/organization/workspace`
- `cloud/organization/metadata-templates`
- `cloud/organization/team`
- `cloud/organization/audit-logs`
- `cloud/organization/billing`

## Watch source icon `eye`

### Start here

- `watch/quick-start`
- `watch/deployment`
- `watch/integration`
- `watch/mental-model`
- `changelog/blnk-watch`

### Watch scripts

- `watch/rules/rule-structure`
- `watch/rules/setting-conditions`
- `watch/rules/defining-verdicts`
- dropdown **Examples** source icon `lightbulb`
  - `watch/rules/examples/basic-conditions`
  - `watch/rules/examples/compound-conditions`
  - `watch/rules/examples/aggregate-conditions`
  - `watch/rules/examples/time-based-conditions`

### Advanced

- `watch/configuration`
- `watch/commands`
- `watch/webhooks`

## API Reference source icon `library`

### Core APIs source icon `layers`

#### Start Here

- `reference/overview`

#### Ledgers

- `reference/create-ledger`
- `reference/get-ledger`
- `reference/update-ledger-name`

#### Ledger balances

- `reference/create-balance`
- `reference/get-balance`
- `reference/get-balance-lineage`
- `reference/get-balance-by-indicator`
- `reference/update-balance-identity`
- `reference/balances-snapshots`
- `reference/historical-balances`
- `reference/balance-from-source`
- `reference/create-balance-monitor`
- `reference/get-balance-monitor`
- `reference/edit-balance-monitor`
- `reference/delete-balance-monitor`

#### Transactions

- `reference/create-transaction`
- `reference/dry-run`
- `reference/get-transaction`
- `reference/get-transaction-lineage`
- `reference/get-transaction-by-reference`
- `reference/update-inflight`
- `reference/bulk-commit-inflight`
- `reference/bulk-void-inflight`
- `reference/refund-transaction`
- `reference/multiple-sources`
- `reference/multiple-destinations`
- `reference/bulk-transactions`
- `reference/queue-recovery`

#### Reconciliation

- `reference/start-reconciliation`
- `reference/instant-reconciliation`
- `reference/get-reconciliations`
- `reference/upload-data`
- `reference/create-matching-rule`
- `reference/update-matching-rule`
- `reference/delete-matching-rule`

#### Identities

- `reference/create-identity`
- `reference/get-identity`
- `reference/edit-identity`
- `reference/tokenize-field`
- `reference/tokenize-identity`
- `reference/get-tokenized-fields`
- `reference/detokenize-field`
- `reference/detokenize-identity`

#### Metadata

- `reference/update-metadata`

#### Search

- `reference/search-db`
- `reference/search-typesense`
- `reference/start-reindex`
- `reference/get-reindex`

#### Transaction hooks

- `reference/create-hooks`
- `reference/update-hooks`
- `reference/view-hooks`
- `reference/list-hooks-by-type`
- `reference/delete-hooks`

#### API keys

- `reference/create-api-key`
- `reference/get-api-key`
- `reference/delete-api-key`

#### System

- `reference/get-health`
- `reference/get-metrics`

### Cloud APIs source icon `cloud`

#### Start Here

- `cloud/reference/overview`
- dropdown **Authentication** source icon `lock`
  - `cloud/reference/api-keys`
  - `cloud/reference/oauth`

#### Deployments

- `cloud/reference/create-deployment`
- `cloud/reference/get-instance`
- `cloud/reference/list-deployments`
- `cloud/reference/get-deployment`
- `cloud/reference/get-deployment-config`
- `cloud/reference/update-deployment-config`
- `cloud/reference/upgrade-deployment`
- `cloud/reference/destroy-deployment`

#### Proxy & data

- `cloud/reference/proxy-api`

#### Data lake

- `cloud/reference/create-new-query`
- `cloud/reference/get-lake-schema`
- `cloud/reference/list-lake-query-runs`
- `cloud/reference/get-lake-query-run`
- `cloud/reference/create-saved-lake-query`
- `cloud/reference/list-saved-lake-queries`
- `cloud/reference/get-saved-lake-query`
- `cloud/reference/update-saved-lake-query`
- `cloud/reference/delete-saved-lake-query`
- `cloud/reference/schedule-saved-lake-query`
- `cloud/reference/delete-saved-lake-query-schedule`

#### AI integrations

- `cloud/reference/mcp`
- `cloud/reference/create-agent`
- `cloud/reference/get-agent-status`
- `cloud/reference/get-agent-result`
- `cloud/reference/control-agent`

#### Audit

- `cloud/reference/list-audit-logs`

#### Alerts

- `cloud/reference/create-alert`
- `cloud/reference/get-alert`
- `cloud/reference/update-alert`
- `cloud/reference/list-alert-statuses`
- `cloud/reference/create-alert-status`
- `cloud/reference/update-alert-status`
- `cloud/reference/delete-alert-status`

#### Billing

- `cloud/reference/get-billing-status`
- `cloud/reference/get-billing-overview`
- `cloud/reference/list-invoices`
- `cloud/reference/get-usage-billing`
- `cloud/reference/enable-usage-billing`
- `cloud/reference/get-record-counts`

### Watch APIs source icon `eye`

#### Start Here

- `watch/reference/overview`

#### Transactions

- `watch/reference/inject-transaction`
- `watch/reference/blnk-webhook`
- `watch/reference/get-verdict`

#### Instructions

- `watch/reference/compile-and-save-instruction`
- `watch/reference/list-instructions`
- `watch/reference/get-instruction`
- `watch/reference/delete-instruction`

#### Git sync

- `watch/reference/get-git-status`
- `watch/reference/sync-git-repository`

## SDKs & CLI source icon `package`

### Blnk CLI source icon `terminal`

#### Start Here

- `cli/install`
- `cli/using-blnk-core`
- `cli/global-flags`
- `cli/output-formats`
- `changelog/blnk-cli`

#### Resource commands

- `cli/ledgers`
- `cli/balances`
- `cli/transactions`
- `cli/identities`
- `cli/reconciliations`

#### Additional commands

- `cli/help`
- `cli/version`
- `cli/reindex`
- `cli/community`
- `cli/docs`

### Typescript SDK source icon `/icons/node-js.svg`

#### Start Here

- `sdks/typescript/start/quick-start`
- `sdks/typescript/start/using-the-sdk`
- `sdks/typescript/start/error-handling`
- `changelog/blnk-ts`

#### Ledgers

- `sdks/typescript/ledgers/create-ledger`
- `sdks/typescript/ledgers/get-ledger`
- `sdks/typescript/ledgers/update-ledger`

#### Ledger balances

- `sdks/typescript/ledger-balances/create-balance`
- `sdks/typescript/ledger-balances/get-balance`
- `sdks/typescript/ledger-balances/get-balance-lineage`
- `sdks/typescript/ledger-balances/get-balance-by-indicator`
- `sdks/typescript/ledger-balances/update-balance-identity`
- `sdks/typescript/ledger-balances/balances-snapshots`
- `sdks/typescript/ledger-balances/historical-balances`
- `sdks/typescript/ledger-balances/balance-from-source`
- `sdks/typescript/ledger-balances/create-balance-monitor`
- `sdks/typescript/ledger-balances/get-balance-monitor`
- `sdks/typescript/ledger-balances/list-balance-monitors`
- `sdks/typescript/ledger-balances/edit-balance-monitor`
- `sdks/typescript/ledger-balances/delete-balance-monitor`

#### Transactions

- `sdks/typescript/transactions/create-transaction`
- `sdks/typescript/transactions/get-transaction`
- `sdks/typescript/transactions/get-transaction-lineage`
- `sdks/typescript/transactions/get-transaction-by-reference`
- `sdks/typescript/transactions/update-inflight`
- `sdks/typescript/transactions/bulk-commit-inflight`
- `sdks/typescript/transactions/bulk-void-inflight`
- `sdks/typescript/transactions/refund-transaction`
- `sdks/typescript/transactions/bulk-transactions`
- `sdks/typescript/transactions/queue-recovery`

#### Reconciliation

- `sdks/typescript/reconciliation/start-reconciliation`
- `sdks/typescript/reconciliation/instant-reconciliation`
- `sdks/typescript/reconciliation/get-reconciliations`
- `sdks/typescript/reconciliation/upload-data`
- `sdks/typescript/reconciliation/create-matching-rule`
- `sdks/typescript/reconciliation/update-matching-rule`
- `sdks/typescript/reconciliation/delete-matching-rule`

#### Identities

- `sdks/typescript/identities/create-identity`
- `sdks/typescript/identities/get-identity`
- `sdks/typescript/identities/edit-identity`
- `sdks/typescript/identities/list-identities`
- `sdks/typescript/identities/tokenize-identity`
- `sdks/typescript/identities/detokenize-identity`
- `sdks/typescript/identities/get-tokenized-fields`
- `sdks/typescript/identities/tokenize-field`
- `sdks/typescript/identities/detokenize-field`
- `sdks/typescript/identities/delete-identity`

#### Metadata

- `sdks/typescript/metadata/update-metadata`

#### Hooks

- `sdks/typescript/hooks/create-hooks`
- `sdks/typescript/hooks/update-hooks`
- `sdks/typescript/hooks/view-hooks`
- `sdks/typescript/hooks/list-hooks-by-type`
- `sdks/typescript/hooks/delete-hooks`

#### Search

- `sdks/typescript/search/search-db`
- `sdks/typescript/search/search-typesense`
- `sdks/typescript/search/start-reindex`
- `sdks/typescript/search/get-reindex`

#### API keys

- `sdks/typescript/api-keys/create-api-key`
- `sdks/typescript/api-keys/list-api-keys`
- `sdks/typescript/api-keys/delete-api-key`

#### System

- `sdks/typescript/system/get-health`

### Go SDK source icon `/icons/golang.svg`

#### Start Here

- `sdks/go/start/quick-start`
- `sdks/go/start/using-the-sdk`
- `sdks/go/start/error-handling`
- `changelog/blnk-go`

#### Ledgers

- `sdks/go/ledgers/create-ledger`
- `sdks/go/ledgers/get-ledger`
- `sdks/go/ledgers/list-ledgers`
- `sdks/go/ledgers/update-ledger`

#### Ledger balances

- `sdks/go/ledger-balances/create-balance`
- `sdks/go/ledger-balances/get-balance`
- `sdks/go/ledger-balances/get-balance-lineage`
- `sdks/go/ledger-balances/get-balance-by-indicator`
- `sdks/go/ledger-balances/update-balance-identity`
- `sdks/go/ledger-balances/balances-snapshots`
- `sdks/go/ledger-balances/historical-balances`
- `sdks/go/ledger-balances/balance-from-source`
- `sdks/go/ledger-balances/create-balance-monitor`
- `sdks/go/ledger-balances/get-balance-monitor`
- `sdks/go/ledger-balances/list-balance-monitors`
- `sdks/go/ledger-balances/edit-balance-monitor`
- `sdks/go/ledger-balances/delete-balance-monitor`

#### Transactions

- `sdks/go/transactions/create-transaction`
- `sdks/go/transactions/get-transaction`
- `sdks/go/transactions/get-transaction-lineage`
- `sdks/go/transactions/get-transaction-by-reference`
- `sdks/go/transactions/update-inflight`
- `sdks/go/transactions/bulk-commit-inflight`
- `sdks/go/transactions/bulk-void-inflight`
- `sdks/go/transactions/refund-transaction`
- `sdks/go/transactions/bulk-transactions`
- `sdks/go/transactions/queue-recovery`

#### Reconciliation

- `sdks/go/reconciliation/start-reconciliation`
- `sdks/go/reconciliation/instant-reconciliation`
- `sdks/go/reconciliation/get-reconciliations`
- `sdks/go/reconciliation/upload-data`
- `sdks/go/reconciliation/create-matching-rule`
- `sdks/go/reconciliation/update-matching-rule`
- `sdks/go/reconciliation/delete-matching-rule`

#### Identities

- `sdks/go/identities/create-identity`
- `sdks/go/identities/get-identity`
- `sdks/go/identities/edit-identity`
- `sdks/go/identities/list-identities`
- `sdks/go/identities/filter-identities`
- `sdks/go/identities/delete-identity`

#### Metadata

- `sdks/go/metadata/update-metadata`

#### Hooks

- `sdks/go/hooks/create-hooks`
- `sdks/go/hooks/update-hooks`
- `sdks/go/hooks/view-hooks`
- `sdks/go/hooks/list-hooks-by-type`
- `sdks/go/hooks/delete-hooks`

#### Search

- `sdks/go/search/search-db`
- `sdks/go/search/search-typesense`
- `sdks/go/search/start-reindex`
- `sdks/go/search/get-reindex`

#### API keys

- `sdks/go/api-keys/create-api-key`
- `sdks/go/api-keys/list-api-keys`
- `sdks/go/api-keys/delete-api-key`

#### System

- `sdks/go/system/get-health`

### Python SDK source icon `/icons/python.svg`

#### Start Here

- `sdks/python/start/quick-start`
- `sdks/python/start/using-the-sdk`
- `sdks/python/start/error-handling`
- `changelog/blnk-py`

#### Ledgers

- `sdks/python/ledgers/create-ledger`
- `sdks/python/ledgers/get-ledger`
- `sdks/python/ledgers/update-ledger`

#### Ledger balances

- `sdks/python/ledger-balances/create-balance`
- `sdks/python/ledger-balances/get-balance`
- `sdks/python/ledger-balances/get-balance-lineage`
- `sdks/python/ledger-balances/get-balance-by-indicator`
- `sdks/python/ledger-balances/update-balance-identity`
- `sdks/python/ledger-balances/balances-snapshots`
- `sdks/python/ledger-balances/historical-balances`
- `sdks/python/ledger-balances/balance-from-source`
- `sdks/python/ledger-balances/create-balance-monitor`
- `sdks/python/ledger-balances/get-balance-monitor`
- `sdks/python/ledger-balances/list-balance-monitors`
- `sdks/python/ledger-balances/edit-balance-monitor`
- `sdks/python/ledger-balances/delete-balance-monitor`

#### Transactions

- `sdks/python/transactions/create-transaction`
- `sdks/python/transactions/get-transaction`
- `sdks/python/transactions/get-transaction-lineage`
- `sdks/python/transactions/get-transaction-by-reference`
- `sdks/python/transactions/update-inflight`
- `sdks/python/transactions/bulk-commit-inflight`
- `sdks/python/transactions/bulk-void-inflight`
- `sdks/python/transactions/refund-transaction`
- `sdks/python/transactions/bulk-transactions`
- `sdks/python/transactions/queue-recovery`

#### Reconciliation

- `sdks/python/reconciliation/start-reconciliation`
- `sdks/python/reconciliation/instant-reconciliation`
- `sdks/python/reconciliation/get-reconciliations`
- `sdks/python/reconciliation/upload-data`
- `sdks/python/reconciliation/create-matching-rule`
- `sdks/python/reconciliation/update-matching-rule`
- `sdks/python/reconciliation/delete-matching-rule`

#### Identities

- `sdks/python/identities/create-identity`
- `sdks/python/identities/get-identity`
- `sdks/python/identities/edit-identity`
- `sdks/python/identities/list-identities`
- `sdks/python/identities/tokenize-identity`
- `sdks/python/identities/detokenize-identity`
- `sdks/python/identities/get-tokenized-fields`
- `sdks/python/identities/tokenize-field`
- `sdks/python/identities/detokenize-field`
- `sdks/python/identities/delete-identity`

#### Metadata

- `sdks/python/metadata/update-metadata`

#### Hooks

- `sdks/python/hooks/create-hooks`
- `sdks/python/hooks/update-hooks`
- `sdks/python/hooks/view-hooks`
- `sdks/python/hooks/list-hooks-by-type`
- `sdks/python/hooks/delete-hooks`

#### Search

- `sdks/python/search/search-db`
- `sdks/python/search/search-typesense`
- `sdks/python/search/start-reindex`
- `sdks/python/search/get-reindex`

#### API keys

- `sdks/python/api-keys/create-api-key`
- `sdks/python/api-keys/list-api-keys`
- `sdks/python/api-keys/delete-api-key`

#### System

- `sdks/python/system/get-health`

### Java SDK source icon `/icons/java.svg`

#### Start Here

- `sdks/java/start/quick-start`
- `sdks/java/start/using-the-sdk`
- `sdks/java/start/error-handling`
- `changelog/blnk-java`

#### Ledgers

- `sdks/java/ledgers/create-ledger`
- `sdks/java/ledgers/get-ledger`
- `sdks/java/ledgers/update-ledger`

#### Ledger balances

- `sdks/java/ledger-balances/create-balance`
- `sdks/java/ledger-balances/get-balance`
- `sdks/java/ledger-balances/get-balance-lineage`
- `sdks/java/ledger-balances/get-balance-by-indicator`
- `sdks/java/ledger-balances/update-balance-identity`
- `sdks/java/ledger-balances/balances-snapshots`
- `sdks/java/ledger-balances/historical-balances`
- `sdks/java/ledger-balances/balance-from-source`
- `sdks/java/ledger-balances/create-balance-monitor`
- `sdks/java/ledger-balances/get-balance-monitor`
- `sdks/java/ledger-balances/list-balance-monitors`
- `sdks/java/ledger-balances/edit-balance-monitor`
- `sdks/java/ledger-balances/delete-balance-monitor`

#### Transactions

- `sdks/java/transactions/create-transaction`
- `sdks/java/transactions/get-transaction`
- `sdks/java/transactions/get-transaction-lineage`
- `sdks/java/transactions/get-transaction-by-reference`
- `sdks/java/transactions/update-inflight`
- `sdks/java/transactions/bulk-commit-inflight`
- `sdks/java/transactions/bulk-void-inflight`
- `sdks/java/transactions/refund-transaction`
- `sdks/java/transactions/bulk-transactions`
- `sdks/java/transactions/queue-recovery`

#### Reconciliation

- `sdks/java/reconciliation/start-reconciliation`
- `sdks/java/reconciliation/instant-reconciliation`
- `sdks/java/reconciliation/get-reconciliations`
- `sdks/java/reconciliation/upload-data`
- `sdks/java/reconciliation/create-matching-rule`
- `sdks/java/reconciliation/update-matching-rule`
- `sdks/java/reconciliation/delete-matching-rule`

#### Identities

- `sdks/java/identities/create-identity`
- `sdks/java/identities/get-identity`
- `sdks/java/identities/edit-identity`
- `sdks/java/identities/list-identities`
- `sdks/java/identities/tokenize-identity`
- `sdks/java/identities/detokenize-identity`
- `sdks/java/identities/get-tokenized-fields`
- `sdks/java/identities/tokenize-field`
- `sdks/java/identities/detokenize-field`
- `sdks/java/identities/delete-identity`

#### Metadata

- `sdks/java/metadata/update-metadata`

#### Hooks

- `sdks/java/hooks/create-hooks`
- `sdks/java/hooks/update-hooks`
- `sdks/java/hooks/view-hooks`
- `sdks/java/hooks/list-hooks-by-type`
- `sdks/java/hooks/delete-hooks`

#### Search

- `sdks/java/search/search-db`
- `sdks/java/search/search-typesense`
- `sdks/java/search/start-reindex`
- `sdks/java/search/get-reindex`

#### API keys

- `sdks/java/api-keys/create-api-key`
- `sdks/java/api-keys/list-api-keys`
- `sdks/java/api-keys/delete-api-key`

#### System

- `sdks/java/system/get-health`
