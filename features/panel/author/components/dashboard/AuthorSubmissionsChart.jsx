"use client";

import { PieChart } from "@/features/shared";

const COLORS = {
  accepted: "var(--chart-1)",
  rejected: "var(--chart-2)",
  under_review: "var(--chart-3)",
  pending: "var(--chart-4)",
};

export default function AuthorSubmissionsChart({ data, isLoading, isError }) {
  const chartData = [
    { name: "Accepted", value: data?.accepted || 0, color: COLORS.accepted },
    { name: "Rejected", value: data?.rejected || 0, color: COLORS.rejected },
    {
      name: "Under Review",
      value: data?.under_review || 0,
      color: COLORS.under_review,
    },
    { name: "Pending", value: data?.pending || 0, color: COLORS.pending },
  ];

  return (
    <PieChart
      title="Submission Status Distribution"
      data={chartData}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No submissions in Accepted, Rejected, Under Review, or Pending status yet"
    />
  );
}
