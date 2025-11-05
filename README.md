# Journal Portal

A Next.js frontend for a journal/reading portal built with a feature-based folder structure. This project uses the App Router (the `app/` directory) and a combination of client-side data fetching (react-query / axios) and global state (Redux Toolkit + redux-persist).

## Project overview

- Purpose: Provide a multi-role journal portal (reader, author, editor, reviewer, admin) with authentication, dashboards, and role-based routing.
- Structure: Feature-based code organization (see `features/`) and a small UI component library in `components/ui` (shadcn-style primitives + Radix).

## Tech stack

- Framework: Next.js 16 (App Router)
- Language: React 19 (JSX)
- Styling: Tailwind CSS (v4) with custom theme variables in `app/globals.css`
- UI primitives: Radix UI primitives + shadcn-style components in `components/ui`
- State management: Redux Toolkit + redux-persist (for auth), @tanstack/react-query for server/cache state
- Forms & validation: react-hook-form + zod
- HTTP client: axios
- Icons: lucide-react
- Notifications: sonner
- Utilities: `class-variance-authority`, `clsx`, `tailwind-merge`

Dependencies are listed in `package.json`.

## Feature-based folder structure

The app organizes code by features (domain areas) under `features/`. Each feature typically contains:

- `components/` — feature-specific React components
- `hooks/` — reusable hooks (query/mutation hooks, UI helpers)
- `api/` — small API client wrappers (axios)
- `redux/` — feature-related Redux slices when needed

Examples of feature folders:

- `features/auth/` — login / register logic, forms, API wrappers, hooks
- `features/dashboard/` — dashboard features split further by role (`reader`, `author`, `editor`)
- `features/shared/` — cross-feature shared components and hooks (FormInputField, RoleBasedAuth, useToggle, etc.)

This approach keeps feature code colocated and easier to reason about.

## Routing overview

- The project uses Next.js App Router (`app/`). Routes are files and folders inside `app/`:
  - `app/(auth)/login` → Login page
  - `app/(auth)/register` → Register page
  - `app/panel/` and its nested folders for role-specific panels
  - `app/reader/dashboard` → reader dashboard

- Client-side navigation uses `next/link` and `next/navigation`.
- Most data fetching for interactive flows is done on the client via react-query and axios (see `features/*/hooks`). Server-rendered data can be provided by server components when needed (App Router patterns).

## State management approach

- Global auth state: Redux Toolkit + `redux-persist` to persist login state across refreshes (see `store/store.js` and `features/auth/redux/authSlice.js`).
- Remote/server data: @tanstack/react-query for caching, refetching, and optimistic updates. Hooks like `useLoginUser` / `useRegisterUser` wrap react-query mutations.
- Local component/UI state: React `useState` or small hooks (e.g., `useToggle`, `useCrossTabAuth`) in `features/shared/hooks`.

## Styling approach

- Tailwind CSS (configured via `app/globals.css`).
- Design tokens and CSS variables are defined in `globals.css` (light + dark themes).
- UI primitives are in `components/ui` following shadcn's approach (Radix primitives + class-variance-authority for variants).

## How to run locally

Requirements: Node 18+ recommended.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

Linting:

```bash
npm run lint
```

## Where to look next

- Feature implementations: `features/` — start with `features/auth` for auth flows.
- Reusable UI: `components/ui/` contains Button, Input, Form, and other primitives.
- Store: `store/store.js` and `lib/authPersist.js` contain Redux persist wiring and auth reducer.

---
For more detailed feature/component-level documentation see the `docs/` folder.

