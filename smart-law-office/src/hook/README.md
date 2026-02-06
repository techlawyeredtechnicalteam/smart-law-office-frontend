# src/hook — Custom React hooks

Purpose: Encapsulate reusable UI behavior (timers, syncing, message polling).

Conventions:

- Hooks that use React state/effects must be client components (`"use client"` inside hook file).
- Keep hooks focused: one responsibility per hook.

Examples:

- `useCountdown.ts` — countdown timer logic.
- `useSyncUser.ts` — keep client user data synced with server.

Testing:

- Extract pure helpers from hooks so they can be unit-tested without React.
