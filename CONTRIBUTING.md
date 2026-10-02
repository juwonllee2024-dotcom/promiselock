# Contributing

Small, focused changes welcome.

1. Open an issue describing the user mistake or browser behavior.
2. Keep detection deterministic and local.
3. Add a failing test before production code for every new rule.
4. Run the full local checks:

   ```bash
   npm ci
   npm test
   npm run typecheck
   npm run lint
   npm run build
   npm run audit
   ```

5. Use fake attachment names and fake URLs in fixtures. Never commit credentials, copied private messages, or real customer data.
6. Explain browser-specific behavior in the pull request.

By contributing, you agree that your contribution is licensed under the repository's MIT license.
