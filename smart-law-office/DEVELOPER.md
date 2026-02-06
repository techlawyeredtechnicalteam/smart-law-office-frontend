# Smart Law Office — Frontend (Developer Guide)

This document helps new developers understand, run, and extend the Smart Law Office frontend application.

---

## Project Summary

- **Name:** Smart Law Office —
- **Purpose:** Next.js TypeScript for a law-office SaaS product: authentication, dashboard, firm profile, cases, communications, scheduling, and billing.
- **Frameworks / Tech:** Next.js (App Router), React, TypeScript, PostCSS.

## Quick start

1. Install dependencies

```bash
npm install
```

1. Run in development

```bash
npm run dev
```

1. Build and start (production)

```bash
npm run build
npm run start
```

1. Environment

- Copy / create an environment file `.env` or `.env.local` at the repository root with required vars. Do not commit secrets.

## Where to look (high level)

- App root and routes: `src/app/` — global layout, middleware, route groups and pages.
- UI components: `src/components/` — grouped by feature (auth, dashboard, firmProfile, shared, ui).
- Client stores: `src/store/` — local app state and hooks.
- Hooks: `src/hook/` — custom React hooks for timers, syncing, etc.
- Utilities: `src/lib/` — cookie helpers and shared utils.
- Types & schemas: `src/types/` — domain interfaces and request/response schemas.
- Server APIs: `src/app/api/` — server-side route handlers.

Useful file pointers:

- App layout: [src/app/layout.tsx](src/app/layout.tsx#L1)
- Global styles: [src/app/globals.css](src/app/globals.css#L1)
- Middleware: [src/app/middleware.ts](src/app/middleware.ts#L1)
- Example store: [src/store/createCase.ts](src/store/createCase.ts#L1)
- Auth store: [src/store/authStore.ts](src/store/authStore.ts#L1)
- API folder: [src/app/api](src/app/api)
- Utilities: [src/lib/cookies.ts](src/lib/cookies.ts#L1)

## Architecture & conventions

- Uses Next.js App Router with nested layouts and route groups. Pages and layouts are server components by default; any component that uses React hooks or browser-only APIs must include `"use client"` at the top.
- Server code: `src/app/api/*` — runs on the server, perform validation and heavy lifting here.
- Client code: components, hooks, and stores under `src/` — keep UI and ephemeral state here.
- Styling: global CSS at `src/app/globals.css`. PostCSS config provided at the project root.
- Type safety: Keep types in `src/types/`. Import and reuse these between client and server when possible.

## Folder-by-folder guide

- `src/app/`
  - `layout.tsx` — top-level HTML shell and providers.
  - `page.tsx` — root landing page.
  - `middleware.ts` — Edge middleware for redirects and auth checks.
  - Route groups: `(auth)`, `(dashboard)`, `firm-profile`, etc. Add nested `page.tsx` and `layout.tsx` files for new routes.

- `src/components/`
  - `auth/` — login, verify, forgot-password UI.
  - `dashboard/` — feature UIs organized by role and feature.
  - `firmProfile/` — firm settings components.
  - `shared/` and `ui/` — atoms and small reusable components (buttons, inputs, modals).

- `src/store/`
  - Domain stores like `authStore.ts`, `createCase.ts`, `assignCaseStore.ts`. They export hooks (e.g., `useAuthStore`) for client components.
  - Pattern: import and call store hooks inside client components. Use actions in stores to encapsulate business logic.

- `src/app/api/`
  - Server route handlers (e.g., `cases.api.ts`, `signup.api.ts`). Follow existing handler patterns when adding new endpoints.

- `src/lib/` — `cookies.ts` and `utils.ts` contain helpers for token management and common utilities. Use these to keep code DRY.

- `src/hook/` — shared hooks like `useSyncUser.ts`, `useCountdown.ts`.

- `src/types/` — TypeScript schemas for payloads and domain models. Keep them authoritative for front + server.

## Typical developer workflows

- Add a new page/route:
  1. Create a folder under `src/app/` or appropriate route-group like `src/app/(dashboard)/my-feature/`.
  2. Add `page.tsx` and optionally `layout.tsx`.
  3. Put UI components under `src/components/` and import them from the page.
  4. If state is shared, add a store under `src/store/`.
  5. Add API endpoints under `src/app/api/` if backend interactions are required.

- Add a new API route:
  1. Create `src/app/api/myRoute.api.ts`.
  2. Export handler functions for HTTP methods and validate body using types in `src/types/`.
  3. Test with `fetch('/api/myRoute')` from the client or `curl`.

- Update global layout/providers:
  - Edit `src/app/layout.tsx` to add context providers, analytics, or global wrappers.

## State management pattern

- Each file in `src/store/` acts as a domain store. The interface usually exposes state and action functions. Prefer calling store actions from UI event handlers rather than scattering logic across components.
- Persisted data (sessions, tokens) often goes through `src/lib/cookies.ts`.

## Debugging & Dev tips

- Dev server logs: Run `npm run dev` and watch the terminal for server/API logs.
- Type checks: Use `npm run build` or `tsc` to catch TypeScript errors.
- Middleware: If new logic in `src/app/middleware.ts` causes unexpected redirects, revert changes and re-test. Middleware runs in edge runtime — no node APIs.
- Client vs server errors: If React complains about hooks or render mismatches, check `"use client"` directives and extraction of data-rendering responsibilities.

## Testing & QA

- There are no tests in the repo by default. Recommended additions:
  - Unit tests for pure utilities and store logic (Jest / Vitest).
  - Integration tests for pages (Playwright / Cypress).

## Deployment

- Standard Next.js build + start. Example:

```bash
npm run build
npm run start
```

- Host on Vercel or any host supporting Next.js App Router. Ensure production environment variables are set on the host.

## Troubleshooting (common issues)

- Build/TS errors: Run `npm run build` locally and fix TypeScript errors reported.
- 500s from APIs: Check server logs in the dev terminal. Validate request bodies and environment variables.
- "use client" errors: Ensure only client components contain hooks and stateful logic.

## Contributing & code style

- Match folder structure and naming conventions.
- Add types for new API payloads to `src/types/`.
- Keep components small and focused; prefer composition over large monolithic components.

---
