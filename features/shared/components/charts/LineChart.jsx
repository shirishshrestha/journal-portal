"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * Reusable Line Chart Component
 *
 * @param {Object} props
 * @param {string} props.title - Chart title
 * @param {Array<Object>} props.data - Chart data
 * @param {Array<{dataKey: string, color?: string, name?: string}>} props.lines - Line configurations
 * @param {string} props.xAxisKey - Key for x-axis (default: "name")
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {string} props.emptyMessage - Message to display when no data
 * @param {string} props.errorMessage - Message to display on error
 * @param {boolean} props.showLegend - Show legend (default: false)
 * @param {boolean} props.showTooltip - Show tooltip (default: true)
 * @param {boolean} props.showGrid - Show grid (default: true)
 * @param {boolean} props.showDots - Show dots on line (default: false)
 * @param {string} props.lineType - Line type: "monotone" | "linear" | "step" (default: "monotone")
 * @param {number} props.strokeWidth - Line stroke width (default: 2)
 * @param {number} props.height - Chart height (default: 300)
 * @param {string} props.className - Additional card className
 */
export function LineChart({
  title,
  data = [],
  lines = [{ dataKey: "value", color: "var(--primary)" }],
  xAxisKey = "name",
  isLoading = false,
  isError = false,
  emptyMessage = "No data to display",
  errorMessage = "Failed to load chart data",
  showLegend = false,
  showTooltip = true,
  showGrid = true,
  showDots = false,
  lineType = "monotone",
  strokeWidth = 2,
  height = 300,
  className = "",
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

  // Empty state
  if (data.length === 0) {
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
          <RechartsLineChart data={data}>
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
            {lines.map((line, index) => (
              <Line
                key={index}
                type={lineType}
                dataKey={line.dataKey}
                stroke={line.color || `var(--chart-${(index % 5) + 1})`}
                strokeWidth={strokeWidth}
                dot={showDots}
                name={line.name || line.dataKey}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
