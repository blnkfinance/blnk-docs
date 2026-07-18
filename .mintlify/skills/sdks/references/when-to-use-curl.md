# When to use cURL

## Appropriate

- Exploring an endpoint in a terminal
- Docs examples and playgrounds
- Reproducing a bug for support

## Not appropriate as app architecture

- Production services in TypeScript, Go, Python, or Java (or any other supported SDK) should call through the SDK
- Shelling out to cURL from an application server

After exploration, implement with [sdk-behavior.md](sdk-behavior.md), or [http-fallback.md](http-fallback.md) only if required.
