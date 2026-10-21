# Enterprise API run

Full output is in `scripts/enterprise/log.txt`. The run exited with failures. Two sections finished with every call successful: instances and audit.

A gateway `404` with `{"error":"Not Found","path":"..."}` means the enterprise host does not register that route. Any other status means the route is exposed. `502` `Application failed to respond` means the route is registered and Core did not answer.

`POST /deployments` returned `400` and did not create a deployment. `GET /deployments` returned `[]`.

## Exposed

These enterprise routes answered with something other than a gateway `Not Found`.

- Access control: list members, list roles, create, update, and delete roles. Assign role returned `404` `Failed to edit member role` for `user_missing`, so the route exists and the user does not.
- Instances: list and get.
- Deployments: create (`400`, `Name` and `Tier` are required), list, get, get config, update config (`400`), upgrade (`500`), and destroy (`500`). The fake id `deploy_missing` was not a live deployment.
- Data lake: schema, create saved query, get, list, patch, schedule (`403` `Credentials do not have permission for this resource`), delete schedule, run query (`503` `QUERY_UNAVAILABLE`), list runs, get run, and delete. The saved-query id is under `data.id`. The runner read a top-level `id`, so the follow-up calls used `lake_query_missing` and the real query was left in place. That query was deleted afterward (`204`).
- Apps: register, list, get, update, and delete. Install returned `401` `app installation requires a user session token`. Launch and uninstall returned `400` because `instapp_missing` does not exist.
- Audit: list logs.
- Alerts: list alerts, status create/update/delete, flag, and get alert.
- Billing: org, usage billing, and record counts. Overview and invoices returned `500` `no Stripe customer found for organization`.
- Agents: job status and job result returned `500` `Internal Server Error` for `job_missing`. Those two routes are registered. Create and control are not.

Proxy routes that are registered: create ledger, create and update identity, tokenized fields, create balance, lineage, historical balance, update balance identity, and the transaction dry run. Tokenize field and tokenize identity returned `500` because tokenization is disabled. After the dry run, Core stopped answering. Recorded transactions, inflight, split, bulk, matching rules, ledger filter, search, reindex status, hooks, and create API key all returned `502`, so those routes are registered too.

## Not exposed

Gateway `Not Found`:

- `GET /oauth/authorize` and `POST /oauth/token`
- `POST /agents/jobs` and `POST /agents/jobs/{job_id}/control`
- `PUT /alerts/flag/{alert_id}`
- `GET` and `PUT /proxy/ledgers/{id}`
- `GET` and `DELETE /proxy/identities/{id}`
- `GET /proxy/balances/{id}`, including `from_source=true`
- `GET /proxy/balances/indicator/{indicator}/currency/{currency}`
- `POST /proxy/balances-snapshots` and `POST /proxy/balance-monitors`
- `GET /proxy/api-keys`, `GET /proxy/health`, and `GET /proxy/metrics`

## Skipped

- Detokenize, because tokenize failed.
- Get and update balance monitor, because create is not exposed.
- Get transaction, refund, commit, bulk commit, and bulk void, because the creates returned `502` and no id.
- Update matching rule, metadata, get/update/delete hook, and revoke API key, for the same reason.
- Queue recovery and Typesense reindex. Those change live data. Reindex status was called and returned `502`.
- `POST /billing/usage-billing`. The API cannot turn usage billing off.

## Needs a fix

OAuth, agent job create, agent job control, and update alert are documented and not registered on this host. Agent status and result are registered, and a missing job id makes them return a plain `500`.

Create deployment validates `Tier` as required. The reference page says `type` is the required field beside `name`.

The lake runner must read `data.id`. Create succeeded, and the later calls never touched that query. Schedule also rejects this API key with `403`.

`GET /billing/overview` and `GET /billing/invoices` should return an empty result when the organization has no Stripe customer.

The proxy is missing get and update ledger, get and delete identity, get balance, get by indicator, snapshots, balance monitors, list API keys, health, and metrics. Create, update identity, lineage, and historical balance on the same resources are registered.

Tokenization needs a 32-byte `BLNK_TOKENIZATION_SECRET` or `tokenization_secret` in `blnk.json`.

Core stopped answering in the middle of transactions and was answering again by the alerts section. The `502` calls need another run once the instance stays up.
