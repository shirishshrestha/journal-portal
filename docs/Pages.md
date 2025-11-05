# Pages Reference

This document lists pages (routes) in the `app/` folder and explains which components they render and how data is fetched.

## Routing (App Router)

- The project uses the app directory (`app/`) for routes. Each folder with a `page.jsx` corresponds to a route.

### Notable routes

- `app/(auth)/login/page.jsx` — Login page. Uses `features/auth/components/LoginForm.jsx` and client-side form submission via `useLoginUser()` (react-query mutation).
- `app/(auth)/register/page.jsx` — Register page. Uses `features/auth/components/RegisterForm.jsx` and `useRegisterUser()`.
- `app/choose-role/page.jsx` — Role selection UI used after sign-in (if applicable).
- `app/unauthorized/page.jsx` — Unauthorized notice (access denied page).
- `app/admin/page.jsx` — Admin entry page (renders admin-specific UI components).

### Panel / role-specific routes

- `app/panel/author/dashboard/*` — Author dashboard pages (if present)
- `app/panel/editor/*` — Editor pages
- `app/panel/reader/*` — Reader pages and nested dashboards

### Reader routes (example from workspace)

- `app/panel/reader/layout.jsx` and `app/panel/reader/dashboard/page.jsx` — Reader layout includes `features/dashboard/reader/components/dashboard/ReaderAppbar.jsx` and `ReaderSidebar.jsx`.
- `app/panel/reader/verification/page.jsx` — A page for reader verification flows.

## Data fetching

- Most interactive flows fetch data on the client using `@tanstack/react-query` and helper API functions in `features/*/api/*` (axios wrappers). Example: `features/auth/api/LoginApiSlice.js`.
- The App Router can host server components; however in this codebase many of the forms and hooks are client components (`"use client"`) and thus rely on client-side mutations + react-query.
- If you add heavy server-side data loading, prefer server components and the `fetch` API or implement `@tanstack/react-query` on the client with server-provided initial state.

## Page responsibilities

- Pages should be thin: routing + layout composition. Move logic into feature hooks (`features/*/hooks`) and small components inside `features/*/components`.
