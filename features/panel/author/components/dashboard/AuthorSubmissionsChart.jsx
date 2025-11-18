"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  accepted: "var(--chart-1)",
  rejected: "var(--chart-2)",
  under_review: "var(--chart-3)",
  pending: "var(--chart-4)",
};

export default function AuthorSubmissionsChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const chartData = [
    { name: "Accepted", value: data.accepted, color: COLORS.accepted },
    { name: "Rejected", value: data.rejected, color: COLORS.rejected },
    {
      name: "Under Review",
      value: data.under_review,
      color: COLORS.under_review,
    },
    { name: "Pending", value: data.pending, color: COLORS.pending },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0 || data.total_submissions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">
            No submissions in Accepted, Rejected, Under Review, or Pending
            status yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                entry.name + ": " + (entry.percent * 100).toFixed(0) + "%"
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
