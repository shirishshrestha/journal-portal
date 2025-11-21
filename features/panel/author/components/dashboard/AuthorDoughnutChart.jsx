"use client";

import { DoughnutChart } from "@/features/shared";

const COLORS = ["var(--chart-1)", "var(--chart-2)"];

/**
 * @param {Object} props
 * @param {Object} props.data - Editor stats: journals, submissions_managed, decisions_made, pending_submissions
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 */
export default function AuthorDoughnutChart({ data, isLoading, isError }) {
  const chartData = [
    { name: "Accepted", value: data?.accepted || 0 },
    { name: "Rejected", value: data?.rejected || 0 },
  ];

  return (
    <DoughnutChart
      title="Author Submission Overview"
      data={chartData}
      colors={COLORS}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No submissions have been accepted or rejected yet."
    />
  );
}
