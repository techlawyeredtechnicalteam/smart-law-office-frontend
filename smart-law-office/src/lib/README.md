# src/lib — Utilities and helpers

Purpose: Shared utilities used across client and server code (cookies, small helpers).

Key files:

- `cookies.ts` — read/write cookie helpers and token helpers.
- `utils.ts` — general helpers (formatters, common logic).

Guidelines:

- Keep functions small and pure where possible.
- Export typed functions and add unit tests for critical utilities.

When to add helpers here:

- Reused logic across multiple components or API routes.
