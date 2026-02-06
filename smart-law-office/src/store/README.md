# src/store — Client state stores

Purpose: Encapsulate client-side state and actions used by UI components.

Conventions:

Patterns:

Example:

Notes:

- src/store — Client state stores

Purpose: Encapsulate client-side state and actions used by UI components.

Conventions:

- Each file exports a hook (e.g., `useAuthStore`) or an object with state and actions.
- Keep side-effects and persistence logic in stores (or centralize in `src/lib/` helpers).

Patterns:

- Use stores to centralize form data, lists, and complex interactions (case creation, invoices, assignments).
- Call store actions from event handlers in client components.

Example:

- `src/store/createCase.ts` manages the case creation flow; import it in the case creation page and call the submit action.

Notes:

- Prefer pure functions inside stores for easier testing.
- If you need cross-tab persistence, integrate cookies helpers in `src/lib/cookies.ts`.
