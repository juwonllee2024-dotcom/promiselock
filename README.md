# PromiseLock 🔒

## Stop sending promises your browser cannot prove.

PromiseLock is a local-first Chrome extension that pauses a message when it says:

- “I attached the report” but no file is visible;
- “Here is the link” but no URL is present;
- `[insert final link]`, `TODO`, or another unfinished placeholder remains.

It works at the send button, across browser chats, email composers, support tools, and local web apps. No account. No cloud. No model. No telemetry.

> **The useful moment is one second before embarrassment.**

## Try the demo

```bash
npm ci
npm run demo
```

Open `http://127.0.0.1:4173/`, click **Send message**, then choose **Send anyway once** or keep editing. Add the fake attachment and send again.

## Install in Chrome or Edge

1. Run `npm run build`.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this project's `dist` folder.
5. Open a page with a composer, click the PromiseLock toolbar icon, then choose **Enable on this tab**.

PromiseLock requests only `activeTab` and `scripting`. It does not receive permanent access to every site. Chrome internal pages such as `chrome://extensions` may reject injection.

## Safety by design

- Reads only the active composer while the extension is enabled on that tab.
- Keeps detection and review in the browser; sends no message text anywhere.
- Pauses only recognized send controls with a finding.
- Gives one explicit **Send anyway once** choice; never auto-sends.
- Does nothing when composer or send target is ambiguous.
- Uses deterministic rules, not an AI call.

## Development

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run audit
```

The rule engine is pure and separately tested in `src/rules.ts`. The browser adapter is in `src/content.ts`; the demo is `examples/demo.html`.

## What is not promised yet

This is an MVP, not proof that every website's composer is supported. Site-specific DOM structures, shadow roots, keyboard-only send flows, and false-positive rates need real-user testing. The seven-day experiment is documented in [`docs/superpowers/specs/2026-10-02-promiselock-design.md`](docs/superpowers/specs/2026-10-02-promiselock-design.md).

## License

MIT. See [`LICENSE`](LICENSE).
