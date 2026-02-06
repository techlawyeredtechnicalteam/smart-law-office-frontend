# src/types — TypeScript schemas and interfaces

Purpose: Central location for domain types, request/response schemas, and validation contracts.

Guidelines:

- Define interfaces and schemas here and import them into both client and server code.
- Keep naming consistent (e.g., `Case`, `User`, `Invoice`, `CreateCasePayload`).

Usage:

- Import types into API handlers and components to ensure end-to-end type safety.

Testing & validation:

- Use these types as the single source of truth when validating incoming requests in `src/app/api`.
