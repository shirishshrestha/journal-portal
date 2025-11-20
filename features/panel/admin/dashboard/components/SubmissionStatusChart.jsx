"use client";

import { BarChart } from "@/features/shared/components/charts";

const COLORS = [
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-1)",
];

export function SubmissionStatusChart({ data, isPending, isError }) {
  const chartData = [
    { name: "Pending", value: data?.pending || 0, color: COLORS[0] },
    { name: "Accepted", value: data?.accepted || 0, color: COLORS[1] },
    { name: "Rejected", value: data?.rejected || 0, color: COLORS[2] },
    { name: "Under Review", value: data?.under_review || 0, color: COLORS[3] },
  ];

  return (
    <BarChart
      title="Submission Status Distribution"
      data={chartData}
      isLoading={isPending}
      isError={isError}
      emptyMessage="No submission status data to display at this time."
      className="shadow-new"
      height={260}
    />
  );
}
