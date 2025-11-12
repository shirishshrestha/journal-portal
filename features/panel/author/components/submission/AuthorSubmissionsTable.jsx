import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/features/shared";
import { BookOpen } from "lucide-react";

const statusConfig = {
  DRAFT: {
    bg: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-900 dark:text-gray-100",
    label: "Draft",
  },
  UNDER_REVIEW: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    label: "Under Review",
  },
  REVISION_REQUIRED: {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-700 dark:text-amber-300",
    label: "Revision Required",
  },
  ACCEPTED: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
    label: "Accepted",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.DRAFT;
  return (
    <Badge className={`${config.bg} ${config.text} border-0`}>
      {config.label}
    </Badge>
  );
}

const columns = [
  {
    key: "title",
    header: "Title",
    render: (row) => (
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="font-medium">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.submission_number}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "journal_name",
    header: "Journal",
    cellClassName: "text-muted-foreground",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "submitted_at",
    header: "Submission Date",
    cellClassName: "text-muted-foreground text-sm",
    render: (row) =>
      row.submitted_at ? format(new Date(row.submitted_at), "PPP") : "-",
  },
  {
    key: "updated_at",
    header: "Last Updated",
    cellClassName: "text-muted-foreground text-sm",
    render: (row) =>
      row.updated_at ? format(new Date(row.updated_at), "PPP") : "-",
  },
];

export default function AuthorSubmissionsTable({ submissions = [] }) {
  return (
    <DataTable
      data={submissions}
      columns={columns}
      emptyMessage="No submissions found"
      tableClassName="bg-card border flex justify-center"
      hoverable
    />
  );
}
