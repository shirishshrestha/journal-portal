"use client";

import { PieChart } from "@/features/shared";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-5)",
];

export function UserDistributionChart({ data, isPending, isError }) {
  const chartData = [
    { name: "Verified", value: data?.verified || 0 },
    { name: "Pending Verifications", value: data?.pending_verifications || 0 },
    { name: "Authors", value: data?.authors || 0 },
    { name: "Reviewers", value: data?.reviewers || 0 },
  ];

  return (
    <PieChart
      title="User Verification Status"
      data={chartData}
      colors={COLORS}
      isLoading={isPending}
      isError={isError}
      emptyMessage="No user distribution data to display at this time."
      className="shadow-new"
      height={260}
    />
  );
}
