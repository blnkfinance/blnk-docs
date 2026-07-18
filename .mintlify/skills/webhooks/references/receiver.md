# Idempotent receiver playbook

## Pipeline

1. **Verify** signature and timestamp ([security.md](security.md)).
2. **Parse** event type and ids (`transaction_id`, `reference`, event id if present).
3. **Dedupe** using a durable store (processed event key). If seen, return 2xx.
4. **Load** current app state; apply transition only if valid.
5. **Commit** app DB changes.
6. **Respond** 2xx quickly. Push heavy work to a background queue if needed.

## Failure and retries

- Blnk may retry on non-2xx. Handlers must tolerate duplicates.
- On handler bugs after side effects: compensate explicitly; do not rely on “exactly once.”

## Checklist

- [ ] Constant-time signature compare
- [ ] Timestamp skew enforced
- [ ] Idempotency table or equivalent
- [ ] Allowlisted event types
- [ ] Handler works for both queue modes (same verify + dedupe)
- [ ] Queued creates do not mark “paid” until applied/rejected events (or poll)
- [ ] Sync path: request handler uses the response; webhook consumers still idempotent
- [ ] Alerting on repeated verification failures

Reference demo patterns conceptually from Blnk webhook demos; keep secrets out of source.
