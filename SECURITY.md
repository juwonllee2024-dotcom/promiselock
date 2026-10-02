# Security Policy

## Scope

PromiseLock is designed to keep message review local. The extension has no network client, account system, remote configuration, clipboard history, or telemetry.

The MVP uses `activeTab` and `scripting` so the user can explicitly enable it on one tab. It reads composer text only to evaluate the local rules and never sends that text to a server.

## Report a vulnerability

Do not open a public issue for a private message, token, or exploit. Use GitHub's private security advisory flow for this repository. Include:

- affected version and browser;
- reproducible steps or a minimal test case;
- what data could leave the browser or what action could happen without approval;
- a suggested mitigation, if known.

Never include real secrets. Use fake values.

## Safety limits

PromiseLock is not a malware scanner or a guarantee that a message is correct. It may miss custom composers and it may warn on intentional wording. Users remain responsible for reviewing content and choosing whether to send.
