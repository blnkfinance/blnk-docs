# HTTP fallback

Use raw HTTP **only** when no Blnk SDK covers the language or the specific endpoint.

## Checklist

- [ ] Confirmed no SDK method exists (docs + SDK source)
- [ ] Documented the gap in a code comment or ADR
- [ ] Single shared client module (not copy-pasted `fetch` everywhere)
- [ ] Sends `X-blnk-key` and `Content-Type: application/json` when required
- [ ] Uses unique `reference` and correct precision fields
- [ ] Plan to switch to SDK when the method ships

## Auth

Header: `X-blnk-key: <api-key>` (scoped key in production).

## Do not

- Bypass the SDK “for simplicity” when the method already exists
- Mix SDK and ad-hoc HTTP for the same resource without reason
