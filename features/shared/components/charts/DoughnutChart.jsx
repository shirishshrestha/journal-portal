"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

/**
 * Reusable Doughnut Chart Component (Pie with inner radius)
 *
 * @param {Object} props
 * @param {string} props.title - Chart title
 * @param {Array<{name: string, value: number, color?: string}>} props.data - Chart data
 * @param {Array<string>} props.colors - Default colors to use if not specified in data
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {string} props.emptyMessage - Message to display when no data
 * @param {string} props.errorMessage - Message to display on error
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {number} props.outerRadius - Outer radius of pie (default: 80)
 * @param {number} props.innerRadius - Inner radius of pie (default: 50)
 * @param {Function} props.labelFormatter - Custom label formatter
 * @param {number} props.height - Chart height (default: 300)
 * @param {string} props.className - Additional card className
 * @param {number} props.paddingAngle - Padding angle between segments (default: 0)
 * @param {React.ReactNode} props.centerContent - Optional content to display in center of doughnut
 */
export function DoughnutChart({
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
  showLegend = true,
  showTooltip = true,
  outerRadius = 80,
  innerRadius = 50,
  labelFormatter = (entry) => `${entry.name}: ${entry.value}`,
  height = 300,
  className = "",
  paddingAngle = 0,
  centerContent = null,
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
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
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

  // Filter out zero values
  const filteredData = data.filter((item) => item.value > 0);

  // Empty state
  if (filteredData.length === 0) {
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
        <div className="relative">
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={labelFormatter}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={paddingAngle}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
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
            </RechartsPieChart>
          </ResponsiveContainer>
          {centerContent && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {centerContent}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
