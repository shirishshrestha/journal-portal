"use client";

import { DoughnutChart } from "@/features/shared/components/charts";

const COLORS = ["var(--chart-3)", "var(--chart-2)"];

export function JournalDistributionChart({ data, isPending, isError }) {
  const chartData = [
    { name: "Active", value: data?.active || 0 },
    { name: "Inactive", value: data?.inactive || 0 },
  ];

  return (
    <DoughnutChart
      title="Journal Status Distribution"
      data={chartData}
      colors={COLORS}
      isLoading={isPending}
      isError={isError}
      emptyMessage="No journal distribution data to display at this time."
      innerRadius={60}
      outerRadius={80}
      paddingAngle={5}
      labelFormatter={(entry) =>
        `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
      }
      className="shadow-new"
      height={260}
    />
  );
}
