# Global Chart Components

This directory contains reusable chart components that provide consistent styling, loading states, error handling, and empty states across the application.

## Components

### 1. PieChart

A reusable pie chart component with customizable colors and formatting.

**Props:**

- `title` (string): Chart title
- `data` (Array): Chart data `[{name, value, color?}]`
- `colors` (Array): Default colors if not specified in data
- `isLoading` (boolean): Loading state
- `isError` (boolean): Error state
- `emptyMessage` (string): Message for empty data
- `errorMessage` (string): Message for error state
- `showLegend` (boolean): Show legend (default: true)
- `showTooltip` (boolean): Show tooltip (default: true)
- `outerRadius` (number): Outer radius (default: 80)
- `labelFormatter` (Function): Custom label formatter
- `height` (number): Chart height (default: 300)
- `className` (string): Additional card className

**Usage:**

```jsx
import { PieChart } from "@/components/ui/charts";

<PieChart
  title="Status Distribution"
  data={[
    { name: "Accepted", value: 10, color: "var(--chart-1)" },
    { name: "Rejected", value: 5, color: "var(--chart-2)" },
  ]}
  isLoading={false}
  isError={false}
/>;
```

### 2. BarChart

A reusable bar chart component with customizable colors and grid options.

**Props:**

- `title` (string): Chart title
- `data` (Array): Chart data `[{name, value, color?}]`
- `colors` (Array): Default colors if not specified in data
- `isLoading` (boolean): Loading state
- `isError` (boolean): Error state
- `emptyMessage` (string): Message for empty data
- `errorMessage` (string): Message for error state
- `showLegend` (boolean): Show legend (default: false)
- `showTooltip` (boolean): Show tooltip (default: true)
- `showGrid` (boolean): Show grid (default: true)
- `dataKey` (string): Key for bar data (default: "value")
- `xAxisKey` (string): Key for x-axis (default: "name")
- `height` (number): Chart height (default: 300)
- `className` (string): Additional card className
- `radius` (Array): Bar corner radius (default: [8, 8, 0, 0])

**Usage:**

```jsx
import { BarChart } from "@/components/ui/charts";

<BarChart
  title="Submissions by Status"
  data={[
    { name: "Pending", value: 15, color: "var(--chart-1)" },
    { name: "Completed", value: 20, color: "var(--chart-2)" },
  ]}
  isLoading={false}
  isError={false}
/>;
```

### 3. DoughnutChart

A reusable doughnut chart (pie with inner radius) with optional center content.

**Props:**

- `title` (string): Chart title
- `data` (Array): Chart data `[{name, value, color?}]`
- `colors` (Array): Default colors if not specified in data
- `isLoading` (boolean): Loading state
- `isError` (boolean): Error state
- `emptyMessage` (string): Message for empty data
- `errorMessage` (string): Message for error state
- `showLegend` (boolean): Show legend (default: true)
- `showTooltip` (boolean): Show tooltip (default: true)
- `outerRadius` (number): Outer radius (default: 80)
- `innerRadius` (number): Inner radius (default: 50)
- `labelFormatter` (Function): Custom label formatter
- `height` (number): Chart height (default: 300)
- `className` (string): Additional card className
- `paddingAngle` (number): Padding between segments (default: 0)
- `centerContent` (ReactNode): Content to display in center

**Usage:**

```jsx
import { DoughnutChart } from "@/components/ui/charts";

<DoughnutChart
  title="Journal Distribution"
  data={[
    { name: "Active", value: 30 },
    { name: "Inactive", value: 10 },
  ]}
  innerRadius={60}
  outerRadius={80}
  paddingAngle={5}
  isLoading={false}
  isError={false}
/>;
```

### 4. LineChart

A reusable line chart component supporting multiple lines.

**Props:**

- `title` (string): Chart title
- `data` (Array): Chart data (each object should contain xAxisKey and line data keys)
- `lines` (Array): Line configurations `[{dataKey, color?, name?}]`
- `xAxisKey` (string): Key for x-axis (default: "name")
- `isLoading` (boolean): Loading state
- `isError` (boolean): Error state
- `emptyMessage` (string): Message for empty data
- `errorMessage` (string): Message for error state
- `showLegend` (boolean): Show legend (default: false)
- `showTooltip` (boolean): Show tooltip (default: true)
- `showGrid` (boolean): Show grid (default: true)
- `showDots` (boolean): Show dots on line (default: false)
- `lineType` (string): Line type: "monotone" | "linear" | "step" (default: "monotone")
- `strokeWidth` (number): Line stroke width (default: 2)
- `height` (number): Chart height (default: 300)
- `className` (string): Additional card className

**Usage:**

```jsx
import { LineChart } from "@/components/ui/charts";

<LineChart
  title="User Growth"
  data={[
    { date: "Mon", users: 100 },
    { date: "Tue", users: 150 },
  ]}
  lines={[{ dataKey: "users", color: "var(--primary)" }]}
  xAxisKey="date"
  isLoading={false}
  isError={false}
/>;
```

## Features

All chart components include:

✅ **Loading State**: Displays skeleton loaders while data is loading
✅ **Error State**: Shows error message when data fetch fails
✅ **Empty State**: Displays custom message when no data is available
✅ **Automatic Zero Filtering**: Filters out zero values in Pie/Doughnut charts
✅ **Responsive**: Charts adapt to container width
✅ **Theme-aware**: Uses CSS variables for colors that adapt to light/dark themes
✅ **Customizable Colors**: Accepts colors from parent or uses default theme colors
✅ **Consistent Styling**: Unified card, tooltip, and legend styling across all charts

## Color Variables

The charts use CSS custom properties for theming:

- `--chart-1` through `--chart-5`: Default chart colors
- `--card`: Card background
- `--border`: Border color
- `--popover-foreground`: Tooltip text color
- `--muted-foreground`: Label text color
- `--primary`: Primary color for lines

## Refactored Components

The following dashboard components have been refactored to use these global charts:

### Author Dashboard

- `AuthorSubmissionsChart` → Uses `PieChart`

### Editor Dashboard

- `EditorSubmissionsChart` → Uses `PieChart`
- `EditorJournalsDoughnutChart` → Uses `DoughnutChart`

### Reviewer Dashboard

- `ReviewerStatsChart` → Uses `BarChart` and `PieChart`

### Admin Dashboard

- `UserDistributionChart` → Uses `PieChart`
- `SubmissionStatusChart` → Uses `BarChart`
- `JournalDistributionChart` → Uses `DoughnutChart`
- `ReviewStatusChart` → Uses `BarChart`
- `UserGrowthChart` → Uses `LineChart`

### Reader Dashboard

- `AutoScoreChart` → Uses `DoughnutChart` with center content

## Benefits

1. **Reduced Code Duplication**: ~70% reduction in chart component code
2. **Consistent UX**: All charts handle loading/error/empty states uniformly
3. **Easier Maintenance**: Bug fixes and improvements in one place
4. **Better Type Safety**: Standardized prop interfaces
5. **Improved Accessibility**: Consistent ARIA patterns and semantic HTML
