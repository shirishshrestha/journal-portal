# State Management

This project uses a hybrid approach for state management: Redux Toolkit for persistent global state (auth), and @tanstack/react-query for server/remote state. Local UI state is handled with React hooks.

## Overview

- Redux Toolkit (RTK): Used for global authenticated user/session information. The `auth` slice is wired into the store in `store/store.js` and persisted with `redux-persist`.
- react-query: Used for server data fetching, caching, and mutations. Example hooks: `useLoginUser` (mutation), other feature-level queries/mutations live under `features/*/hooks`.
- Local state: `useState` and small custom hooks in `features/shared/hooks` (e.g., `useToggle`, `useCrossTabAuth`).

## Store setup

- `store/store.js` shows the store configuration. The reducer has an `auth` key which uses `persistAuthReducer` from `lib/authPersist`.
- The store config disables serializable-check warnings for redux-persist actions.

## Which features use which state

- Authentication (`features/auth`): Uses both react-query mutations (for network requests) and Redux to store the authenticated user object. On successful login the mutation dispatches `authLogin` to the Redux store.
- Dashboard and content features: Prefer react-query for fetching remote resource lists, charts, and other data that benefits from caching and background refetching.
- Local UI (e.g., theme toggling in `ReaderAppbar`, small toggles in forms): use React local state or `next-themes` for theme.

## Best practices and conventions

- Keep global persisted state small (user info, tokens). Use react-query for large or frequently changing remote state.
- Prefer feature-local hooks for data access: add a `hooks/query` or `hooks/mutation` folder in the feature to centralize react-query usage.
