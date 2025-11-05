# Styling & Theme

This project uses Tailwind CSS (v4). Global CSS and design tokens are defined in `app/globals.css`, and components are styled with Tailwind utility classes and composable primitives.

## Global CSS

- `app/globals.css` imports Tailwind and defines design tokens (colors, radii, chart colors) and a `.dark` theme variant.
- CSS variables are used as design tokens and consumed by components via Tailwind classes.

## Tailwind usage

- Tailwind classes are used extensively across components. The project also uses `tw-animate-css` and Tailwind Merge utilities to safely combine classes.
- The helper `cn()` in `lib/utils.js` uses `clsx` + `tailwind-merge` to merge/sanitize class names.

## Component theming and primitives

- Components in `components/ui` are styled as composable primitives (Buttons, Inputs, Form primitives). They expose `className` and variant props to allow customization.
- `class-variance-authority` (CVA) is used in `components/ui/button.jsx` to provide `variant` and `size` props.

## Radix UI and shadcn-style approach

- The project uses Radix primitives (e.g., `@radix-ui/react-dropdown-menu`, `label`, `dialog`) combined with small wrappers to create accessible UI primitives.
- This is consistent with shadcn-style component patterns (headless primitives + Tailwind classes + small wrappers).

## Icons & visuals

- `lucide-react` is used for icons. Charts use `chart.js` and `react-chartjs-2` for graphs and `features/dashboard/reader/components/dashboard/score/AutoScoreChart.jsx` for chart rendering.

## Notes on adding styles

- Prefer adding className and variants in the UI primitive rather than inline styles.
- When creating new components, expose `className` and `asChild` (if composition is useful) for flexibility.
