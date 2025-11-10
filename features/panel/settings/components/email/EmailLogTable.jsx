/**
 * EmailLogTable - Table for displaying email logs
 * @module features/panel/settings/components/email/EmailLogTable
 */
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/features/shared";

const statusColors = {
  SENT: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  FAILED: "bg-red-500/10 text-red-700 dark:text-red-400",
  DELIVERED: "bg-green-500/10 text-green-700 dark:text-green-400",
  OPENED: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

/**
 * @param {Object} props
 * @param {Array<Object>} props.emails - Array of email log objects
 * @param {Function} props.onViewEmail - Callback to view email details
 */
export default function EmailLogTable({ emails, onViewEmail }) {
  const columns = [
    {
      key: "created_at",
      header: "Created At",
      cellClassName: "text-sm text-muted-foreground",
      render: (row) => format(new Date(row.created_at), "MMM dd, yyyy HH:mm"),
    },
    {
      key: "template_type",
      header: "Template Type",
      render: (row) => (
        <Badge
          variant="outline"
          className={`text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-400`}
        >
          {row.template_type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cellClassName: "text-foreground max-w-xs truncate",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge className={`text-xs ${statusColors[row.status]}`}>
          {row.status_display}
        </Badge>
      ),
    },
    {
      key: "retry_count",
      header: "Retries",
      align: "center",
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewEmail(row)}
          className="text-primary hover:text-primary/80 hover:bg-transparent!"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={emails}
      columns={columns}
      emptyMessage="No emails found"
      hoverable={true}
      tableClassName="bg-card border flex justify-center"
    />
  );
}
