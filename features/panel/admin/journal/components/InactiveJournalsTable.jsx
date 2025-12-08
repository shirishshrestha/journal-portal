"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Calendar } from "lucide-react";
import { DataTable } from "@/features/shared";
import { formatDistanceToNow } from "date-fns";

const statusBadgeColors = {
  inactive:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
};

export default function InactiveJournalsTable({
  journals = [],
  onViewDetails,
  onActivate,
  isPending = false,
  error = null,
}) {
  const columns = [
    {
      key: "title",
      header: "Journal Title",
      cellClassName: "font-medium text-foreground",
    },
    {
      key: "short_name",
      header: "Short Name",
      cellClassName: "text-muted-foreground",
    },
    {
      key: "publisher",
      header: "Publisher",
      cellClassName: "text-muted-foreground",
      render: (row) => row.publisher || "-",
    },
    {
      key: "editor_in_chief",
      header: "Editor-in-Chief",
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium">{row.editor_in_chief?.name || "-"}</p>
          <p className="text-xs text-muted-foreground">
            {row.editor_in_chief?.email || ""}
          </p>
        </div>
      ),
    },
    {
      key: "submission_count",
      header: "Submissions",
      align: "center",
      cellClassName: "font-medium text-center",
      render: (row) => row.submission_count || 0,
    },
    {
      key: "created_at",
      header: "Created",
      render: (row) => (
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      align: "center",
      render: (row) => (
        <Badge className={statusBadgeColors.inactive}>Inactive</Badge>
      ),
      cellClassName: "text-center",
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(row)}
            className="h-8 gap-1"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onActivate(row)}
            className="h-8 gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Activate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={journals}
      isPending={isPending}
      error={error}
      emptyMessage="No inactive journals found"
    />
  );
}
