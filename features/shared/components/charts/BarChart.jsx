"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

/**
 * Reusable Bar Chart Component
 *
 * @param {Object} props
 * @param {string} props.title - Chart title
 * @param {Array<{name: string, value: number, color?: string}>} props.data - Chart data
 * @param {Array<string>} props.colors - Default colors to use if not specified in data
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {string} props.emptyMessage - Message to display when no data
 * @param {string} props.errorMessage - Message to display on error
 * @param {boolean} props.showLegend - Show legend (default: false)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {boolean} props.showGrid - Show grid (default: true)
 * @param {string} props.dataKey - Key for bar data (default: "value")
 * @param {string} props.xAxisKey - Key for x-axis (default: "name")
 * @param {number} props.height - Chart height (default: 300)
 * @param {string} props.className - Additional card className
 * @param {Array} props.radius - Bar corner radius (default: [8, 8, 0, 0])
 */
export function BarChart({
  title,
  data = [],
  colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ],
  isLoading = false,
  isError = false,
  emptyMessage = "No data to display",
  errorMessage = "Failed to load chart data",
  showLegend = false,
  showTooltip = true,
  showGrid = true,
  dataKey = "value",
  xAxisKey = "name",
  height = 300,
  className = "",
  radius = [8, 8, 0, 0],
}) {
  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <p className="text-destructive text-center">{errorMessage}</p>
        </CardContent>
      </Card>
    );
  }

  // Check if all values are zero
  const allZero =
    data.length === 0 || data.every((item) => item[dataKey] === 0);

  // Empty state
  if (allZero) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <p className="text-muted-foreground text-center">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            )}
            <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{ color: "var(--popover-foreground)" }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
            )}
            {showLegend && <Legend />}
            <Bar dataKey={dataKey} radius={radius}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
