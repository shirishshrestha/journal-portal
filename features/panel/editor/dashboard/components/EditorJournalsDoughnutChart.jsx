"use client";

import { DoughnutChart } from "@/features/shared";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

/**
 * @param {Object} props
 * @param {Object} props.data - Editor stats: journals, submissions_managed, decisions_made, pending_submissions
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 */
export default function EditorJournalsDoughnutChart({
  data,
  isLoading,
  isError,
}) {
  const chartData = [
    { name: "Submissions Managed", value: data?.submissions_managed || 0 },
    { name: "Pending Submissions", value: data?.pending_submissions || 0 },
  ];

  return (
    <DoughnutChart
      title="Editorial Overview"
      data={chartData}
      colors={COLORS}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No submissions have been managed yet, and there are no pending submissions."
    />
  );
}
