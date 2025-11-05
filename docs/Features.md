# Features Reference

This document explains the main feature folders in the project, what they do, and the key components/pages/hooks inside each feature.

## features/auth

- Purpose: Authentication flows (login, register), validation schemas and API wrappers.
- Key files and folders:
  - `features/auth/components/LoginForm.jsx` — Client-side login form using `react-hook-form`, zod validation and a react-query mutation `useLoginUser`.
  - `features/auth/components/RegisterForm.jsx` — Registration form with fields, validation and `useRegisterUser` mutation.
  - `features/auth/api/LoginApiSlice.js` — axios wrapper to POST login credentials to the backend (`API_URL + auth/login/`).
  - `features/auth/api/RegisterApiSlice.js` — axios wrapper for registration.
  - `features/auth/hooks/mutation/useLoginUser.js` — A react-query `useMutation` that calls `loginUser`, dispatches `authLogin` to Redux on success, and shows sonner toasts.
  - `features/auth/hooks/mutation/useRegisterUser.js` — Mutation for user registration.
  - `features/auth/redux/authSlice.js` — Redux slice for auth state; persisted via `redux-persist`.
  - `features/auth/utils/authSchema.js` — zod schema for login & register forms.

### Notes

- Login/Register forms are client components (`"use client"`) and rely on shared form primitives in `components/ui/form` and `features/shared/components/FormInputField.jsx`.
- Authentication side-effects: on successful login the code broadcasts cross-tab events (via `useCrossTabAuth`) and navigates depending on roles (`useRoleRedirect`).

## features/dashboard

- Purpose: Dashboard and role-specific UI. The dashboard is further partitioned by role under `features/dashboard/reader`, `author`, etc.

### Reader dashboard (features/dashboard/reader)

- `components/dashboard/ReaderAppbar.jsx` — Appbar for reader dashboard. Props: `userName`, `roles`, `userDetails`. Provides theme switch, role switcher, and profile menu.
- `components/dashboard/ReaderSidebar.jsx` — Sidebar with navigation links for reader (Overview, Profile, Verification, Settings).
- `components/dashboard/ScoreCard.jsx` — Dashboard card showing scoring information (uses Chart components).
- `components/dashboard/score/AutoScoreChart.jsx` and `ScoreBreakDownList.jsx` — chart and breakdown components for the ScoreCard.

### Notes

- Dashboard components read data from react-query hooks or local APIs in the corresponding `api/` folders (if present). Many components are client components (`"use client"`) because they rely on hooks and state.

## features/shared

- Purpose: Reusable components and hooks shared across features.
- Key items:
  - `features/shared/components/FormInputField.jsx` — wrapper for a form field wired to `react-hook-form`'s `Controller` and the project's `Form` primitives.
  - `features/shared/components/SystemSidebar.jsx` — system-wide sidebar (used in admin/panel areas).
  - `features/shared/components/RoleBasedAuth.jsx` — component to guard UI by role.
  - Hooks: `useToggle.js`, `useRoleRedirect.js`, `useCrossTabAuth.js` — small utilities used across the app.

### Notes

- Put cross-cutting UI and hook logic here so other features can reuse it without duplication.

## How to use this document

- If you need to add a new feature, create a top-level folder under `features/` with `components/`, `hooks/`, and `api/` subfolders where appropriate.
- Keep feature-local API wrappers inside the feature's `api/` folder. Use react-query hooks under `hooks/` for server state.
