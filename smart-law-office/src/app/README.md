# src/app — Next.js App Router (Routes & Layouts)

Purpose: This folder contains the Next.js App Router routes, nested layouts, middleware, and top-level pages. It is the entrypoint for the frontend routing tree.

Key files

- `layout.tsx` — Global layout and providers used across routes.
- `page.tsx` — Page components (root or nested) that render the route's UI.
- `middleware.ts` — Edge middleware for auth, redirects, and request-handling logic.

Routing & structure

- The App Router uses folders to define routes. Nested folders create nested routes and layouts. Route-group folders (e.g., `(auth)`, `(dashboard)`) group related routes and share layouts without affecting the URL.
- Server components are the default. Any file that uses React client APIs (hooks, state, event handlers) must include `"use client"` at the top.

Common folder patterns

- `(auth)/` — Authentication pages (login, verify, forgot password).
- `(dashboard)/` — Authenticated dashboard pages with nested admin/client sections.
- `firm-profile/` — Company settings pages.
- `api/` — Server API route handlers (see `src/app/api/README.md`).

How to add a new route

1. Create a new folder under `src/app` or within a route group (for shared layout): `src/app/(dashboard)/my-feature/`.
2. Add `page.tsx` for the route UI.
3. Optionally add `layout.tsx` in the same folder to provide a nested layout for that route subtree.

Middleware notes

- `middleware.ts` runs on the edge and should avoid Node-only APIs (no fs, process-specific internals). Use it for lightweight checks (auth redirects, rewrites).
- Test middleware changes carefully — incorrect redirect logic can lock you out of routes during dev.

Server vs Client

- Keep data fetching, secure logic, and secrets in server components or API routes under `src/app/api`.
- Use client components for interactive UI only; declare `"use client"` at file top.

Best practices

- Centralize business logic in stores (`src/store/`) or API routes, keep components presentational.
- Use `src/types/` for shared type definitions between server and client.
- Prefer nested layouts for shared UI (sidebars, headers) to avoid duplication.

Useful links

- App layout: [src/app/layout.tsx](src/app/layout.tsx#L1)
- Root page: [src/app/page.tsx](src/app/page.tsx#L1)
- Middleware: [src/app/middleware.ts](src/app/middleware.ts#L1)
- API routes: [src/app/api](src/app/api)
