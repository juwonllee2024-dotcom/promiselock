# PromiseLock Design

## One-line value

PromiseLock stops a message at send time when it claims an attachment, link, or completed placeholder that the composer cannot show.

## User and problem

The first user is a developer, student, or support worker who sends messages through browser chat and email composers. They repeatedly write “attached,” “here is the link,” or leave `[insert file]` and `TODO` markers, then discover the mistake after sending. Existing mail-specific checks do not cover arbitrary AI chats, support tools, or local/self-hosted web apps.

## Product boundary

- Chrome Manifest V3 extension.
- User activates it on the current tab from the toolbar; no permanent host permission.
- Content script watches only visible composer text and nearby attachment evidence.
- Recognized send buttons are paused only when a finding exists.
- Review dialog offers `Send anyway` once, `Go back`, or `Cancel`.
- No network, account, telemetry, clipboard history, AI/model calls, or automatic sending.
- MVP rules: missing attachment, missing URL/link, and unresolved placeholder.

## Architecture

`rules.ts` is a pure detector. `composer.ts` extracts editor text and nearby attachment/link evidence. `content.ts` observes input and intercepts recognized send-button clicks. `review.ts` renders a Shadow DOM review dialog and replays one approved click. `popup.ts` injects `content.js` into the active tab through `activeTab` and `scripting`. `examples/demo.html` provides a visible local demo.

## Safety and failure behavior

- If composer or send target is ambiguous, do nothing.
- If attachment state cannot be proven, report “attachment not verified” rather than claiming it is absent.
- Never inspect unrelated page text or transmit composer contents.
- Never replay a click without the user's explicit one-time approval.
- Chrome internal pages may reject injection; README documents this.

## Verification

- Unit tests prove each detector and safe “no finding” path.
- TDD RED run must fail because detector modules do not exist; GREEN run must pass.
- Fresh commands: test, typecheck, lint, build, demo smoke, dependency audit, diff check, and security scan.
- Publish only after all checks pass. Release v0.1.0 includes a SHA-256 record.

## Seven-day experiment

Give the unpacked extension to five browser-chat users. Each performs ten seeded messages: five safe, three missing-attachment/link cases, and two placeholder cases. Record blocked-send accuracy, false positives, and whether they keep it enabled for seven days.

## Business hypothesis

Free local OSS builds trust and distribution. A later paid team layer could ship shared rule packs and aggregate policy outcomes without message content. Revenue is unverified.

## Candidate score

| Candidate | Pain | Novelty | Build today | Shareability | OSS fit | Total | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| PromiseLock | 5 | 4 | 5 | 5 | 5 | 24/25 | Select |
| ContextBorrow | 4 | 3 | 4 | 4 | 5 | 20/25 | Reject: overlaps Tab2Patch |
| ErrorZip | 4 | 3 | 4 | 4 | 4 | 19/25 | Reject: overlaps Failcase/Reprocard |
| OutsideClick | 3 | 4 | 5 | 3 | 4 | 19/25 | Reject: too narrow |
