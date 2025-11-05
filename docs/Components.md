# Components Reference

This file documents the reusable UI components in `components/ui` and the shared components under `features/shared/components`.

## components/ui (reusable primitives)

### Button

- File: `components/ui/button.jsx`
- Description: Shadcn-style Button primitive built using `class-variance-authority` (CVA) and Radix `Slot` support.
- Props:
  - `className` (string) — additional class names to merge
  - `variant` (string) — one of `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Controls visual styles via `buttonVariants`.
  - `size` (string) — `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`.
  - `asChild` (boolean) — if true, renders `Slot` to allow composition with link wrappers.
  - All other native button props (onClick, type, disabled, etc.) are forwarded via `...props`.

Example usage:

```jsx
<Button type="submit" variant="default" size="lg">Save</Button>

// as child (for Link wrappers)
<Link href="/register"><Button asChild><a>Register</a></Button></Link>
```

### Input

- File: `components/ui/input.jsx`
- Description: Simple styled input that forwards all props.
- Props:
  - `className` (string)
  - `type` (string) — e.g. `text`, `password`, `email`, etc.
  - All other native input props are forwarded.

### Form primitives

- File: `components/ui/form.jsx`
- Description: A small wrapper around `react-hook-form` with `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`.
- Usage: These primitives are used together with `Controller` to build controlled inputs connected to `react-hook-form`.

Example (usage in `FormInputField`):

```jsx
<FormField
  control={control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Remaining UI primitives

- `components/ui/checkbox.jsx` — styled checkbox (Radix wrapper)
- `components/ui/dialog.jsx` — dialog wrapper
- `components/ui/dropdown-menu.jsx` — dropdown primitives used throughout (ReaderAppbar uses it)
- `components/ui/label.jsx`, `progress.jsx`, `separator.jsx`, `sheet.jsx`, `sidebar.jsx`, `skeleton.jsx`, `sonner.jsx`, `tooltip.jsx` — small primitives used by pages and features.

## features/shared/components

### FormInputField

- File: `features/shared/components/FormInputField.jsx`
- Purpose: Small convenience wrapper to create a `react-hook-form` controlled input. It composes `FormField` + `FormItem` + `FormControl` + `Input`.
- Props:
  - `control` — `react-hook-form` control instance
  - `name` — field name (string)
  - `placeholder` — placeholder text
  - `label` — optional label text
  - `className` — passed to the `Input`
  - any other input props are forwarded

Example:

```jsx
<FormInputField
  control={form.control}
  name="email"
  label="Email"
  placeholder="you@email.com"
  className="h-11"
/>
```

### RoleBasedAuth

- File: `features/shared/components/RoleBasedAuth.jsx`
- Purpose: Wraps children and restricts rendering based on current user role(s). Use when you want UI-level role checks.

## Utilities used by components

- `lib/utils.js` exports `cn()` — a tiny helper combining `clsx` + `tailwind-merge` to safely merge class names.

## Styling notes

- Components use Tailwind classes and design tokens from `app/globals.css`.
- Many primitives are designed to be composable via `asChild` and `Slot`.
