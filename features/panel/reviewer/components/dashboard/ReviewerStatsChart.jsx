"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, PieChart } from "@/features/shared";

const COLORS = {
  pending: "var(--chart-1)",
  accepted: "var(--chart-2)",
  completed: "var(--chart-3)",
  declined: "var(--chart-4)",
};

export default function ReviewerStatsChart({
  reviewerStats,
  isLoading,
  isError,
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assignments by Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviewerStats?.total_assignments === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Assignments Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No review assignments yet</p>
        </CardContent>
      </Card>
    );
  }

  const barChartData = [
    {
      name: "Pending",
      value: reviewerStats?.pending || 0,
      color: COLORS.pending,
    },
    {
      name: "Accepted",
      value: reviewerStats?.accepted || 0,
      color: COLORS.accepted,
    },
    {
      name: "Completed",
      value: reviewerStats?.completed || 0,
      color: COLORS.completed,
    },
    {
      name: "Declined",
      value: reviewerStats?.declined || 0,
      color: COLORS.declined,
    },
  ];

  const pieChartData = [
    {
      name: "Pending",
      value: reviewerStats?.pending || 0,
      color: COLORS.pending,
    },
    {
      name: "Accepted",
      value: reviewerStats?.accepted || 0,
      color: COLORS.accepted,
    },
    {
      name: "Completed",
      value: reviewerStats?.completed || 0,
      color: COLORS.completed,
    },
    {
      name: "Declined",
      value: reviewerStats?.declined || 0,
      color: COLORS.declined,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BarChart
        title="Assignments by Status"
        data={barChartData}
        isLoading={false}
        isError={isError}
        emptyMessage="No review assignments yet"
      />

      <PieChart
        title="Status Distribution"
        data={pieChartData}
        isLoading={false}
        isError={isError}
        emptyMessage="No review assignments yet"
        showLegend={true}
      />
    </div>
  );
}
