"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Eye,
  Download,
  MoreVertical,
  ClipboardList,
} from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/features/shared";

const statusColors = {
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  ACCEPTED: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  COMPLETED:
    "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  OVERDUE: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { label: "Pending" },
    ACCEPTED: { label: "Accepted" },
    COMPLETED: { label: "Completed" },
    OVERDUE: { label: "Overdue" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const colorClass = statusColors[status] || statusColors.PENDING;

  return <Badge className={`${colorClass} border-0`}>{config.label}</Badge>;
};

/**
 * ReviewAssignmentsTable - Displays review assignments in a table
 * @param {Object} props
 * @param {Array} props.assignments - Review assignments data
 * @param {Function} props.onAcceptReview - Callback for accepting review
 * @param {Function} props.onDeclineReview - Callback for declining review
 * @param {Function} props.onStartReview - Callback for starting review
 * @param {Function} props.onDownloadFiles - Callback for downloading files
 * @param {boolean} [props.isPending] - Show loading state
 * @param {Object} [props.error] - Error object
 */
export default function ReviewAssignmentsTable({
  assignments,
  onAcceptReview,
  onDeclineReview,
  onStartReview,
  onDownloadFiles,
  isPending = false,
  error = null,
}) {
  const columns = [
    {
      key: "submission_title",
      header: "Submission Title",
    },
    {
      key: "journal_name",
      header: "Journal",
      cellClassName: "text-sm",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (row) => (
        <span className="text-sm">
          {format(new Date(row.due_date), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      key: "days_remaining",
      header: "Days Remaining",
      render: (row) => (
        <div
          className={`text-sm font-semibold ${
            row.is_overdue
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {row.is_overdue
            ? `${Math.abs(row.days_remaining)} days overdue`
            : `${row.days_remaining} days left`}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.status === "PENDING" && (
              <>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onAcceptReview?.(row)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Accept Review
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive"
                  onClick={() => onDeclineReview?.(row)}
                >
                  Decline Review
                </DropdownMenuItem>
              </>
            )}
            {row.status === "ACCEPTED" && (
              <DropdownMenuItem
                className="gap-2"
                onClick={() => onStartReview?.(row)}
              >
                <Eye className="h-4 w-4" />
                Start Review
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onDownloadFiles?.(row)}
            >
              <Download className="h-4 w-4" />
              Download Files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={assignments}
      columns={columns}
      emptyMessage="No review assignments yet."
      isPending={isPending}
      error={error}
      errorMessage="Error loading review assignments"
      hoverable={true}
      tableClassName="bg-card border"
    />
  );
}
