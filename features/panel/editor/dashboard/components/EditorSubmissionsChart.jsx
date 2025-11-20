"use client";

import { PieChart } from "@/features/shared";

const COLORS = {
  journals: "var(--chart-1)",
  submissions_managed: "var(--chart-5)",
  decisions_made: "var(--chart-3)",
  pending: "var(--chart-4)",
};

export default function EditorSubmissionsChart({ data, isLoading, isError }) {
  const chartData = [
    {
      name: "Journals",
      value: data?.journals || 0,
      color: COLORS.journals,
    },
    {
      name: "Submissions Managed",
      value: data?.submissions_managed || 0,
      color: COLORS.submissions_managed,
    },
    {
      name: "Decisions Made",
      value: data?.decisions_made || 0,
      color: COLORS.decisions_made,
    },
    {
      name: "Pending",
      value: data?.pending_submissions || 0,
      color: COLORS.pending,
    },
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
