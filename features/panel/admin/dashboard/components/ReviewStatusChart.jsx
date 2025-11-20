"use client";

import { BarChart } from "@/features/shared";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-2)",
];

export function ReviewStatusChart({ data, isPending, isError }) {
  const chartData = [
    { name: "Total", value: data?.total || 0, color: COLORS[0] },
    { name: "Pending", value: data?.pending || 0, color: COLORS[1] },
    { name: "Completed", value: data?.completed || 0, color: COLORS[2] },
    { name: "Declined", value: data?.declined || 0, color: COLORS[3] },
  ];

  return (
    <BarChart
      title="Review Status Distribution"
      data={chartData}
      isLoading={isPending}
      isError={isError}
      emptyMessage="No review status data to display at this time."
      className="shadow-new"
      height={260}
    />
  );
}
