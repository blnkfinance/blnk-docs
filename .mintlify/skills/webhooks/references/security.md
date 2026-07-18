# Webhook security

Docs: [Webhook security](https://docs.blnkfinance.com/webhooks/overview#webhook-security).

## Headers

| Header | Meaning |
| :-- | :-- |
| `X-Blnk-Signature` | Hex-encoded HMAC-SHA256 of the signed payload |
| `X-Blnk-Timestamp` | Unix timestamp (seconds) for the signed payload and replay protection |

Reject requests missing either header.

## Verify

1. Read signature and timestamp headers.
2. Reject if timestamp is outside your allowed skew (replay protection).
3. Build the signed payload as documented (timestamp + body).
4. Compute `hex(HMAC-SHA256(server.secret_key, signed))`.
5. Compare to `X-Blnk-Signature` with **constant-time** comparison.

Secret key is `server.secret_key` from Blnk config ([secure Blnk](https://docs.blnkfinance.com/advanced/secure-blnk)).

## Rules

- Verify before parsing business side effects into your DB.
- Do not log the secret key.
- Rotate secrets with a dual-verify window if you change keys.
