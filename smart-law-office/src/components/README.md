# src/components — UI components

 Purpose: Hold presentational UI bits and feature components used by pages.

 Structure & conventions:

- Grouped by feature: `auth/`, `dashboard/`, `firmProfile/`, `shared/`, `ui/`.
- Keep components small and focused. Prefer composition: build pages from small atoms → molecules → organisms.
- Client components that use hooks or browser APIs must include `"use client"` at the top of the file.

 See also: [src/app](src/app) routes and pages which compose these components.
