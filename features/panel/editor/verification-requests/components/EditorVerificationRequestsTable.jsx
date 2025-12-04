"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DataTable } from "@/features/shared";
import EllipsisTooltip from "@/components/ui/EllipsisTooltip";

const statusColors = {
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
  APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
  INFO_REQUESTED:
    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  WITHDRAWN: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100",
};

export function EditorVerificationRequestsTable({
  requests,
  onViewDetails,
  isPending,
  error,
}) {
  const columns = [
    {
      key: "profile_name",
      header: "Name",
      cellClassName: "font-medium text-sm",
    },
    {
      key: "profile_email",
      header: "Email",
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "journal_name",
      header: "Journal",
      render: (row) => (
        <EllipsisTooltip
          text={row.journal_name || "N/A"}
          maxLength={30}
          spanProps={{ className: "text-sm text-muted-foreground" }}
        />
      ),
    },
    {
      key: "requested_roles",
      header: "Requested Roles",
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.requested_roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
            >
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "affiliation",
      header: "Affiliation",
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "academic_position",
      header: "Position",
      render: (row) => (
        <span className="text-sm capitalize">{row.academic_position}</span>
      ),
    },
    {
      key: "auto_score",
      header: "Score",
      align: "center",
      render: (row) => (
        <Badge
          variant="outline"
          className={`text-xs ${
            row.auto_score >= 70
              ? "bg-green-500/10 text-green-700 dark:text-green-400"
              : row.auto_score >= 40
              ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
              : "bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
          {row.auto_score}/100
        </Badge>
      ),
    },
    {
      key: "orcid_verified",
      header: "ORCID",
      align: "center",
      render: (row) => (
        <Badge
          variant="outline"
          className={`text-xs ${
            row.orcid_verified
              ? "bg-green-500/10 text-green-700 dark:text-green-400"
              : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
          }`}
        >
          {row.orcid_verified ? "Verified" : "Not Verified"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge className={`text-xs ${statusColors[row.status]}`}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Submitted",
      render: (row) =>
        formatDistanceToNow(new Date(row.created_at), { addSuffix: true }),
      cellClassName: "text-sm text-muted-foreground",
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row)}
          className="text-primary hover:text-primary/80 hover:bg-transparent!"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={requests}
      columns={columns}
      emptyMessage="No verification requests found"
      isPending={isPending}
      error={error}
      errorMessage="Error loading verification requests"
      hoverable={true}
      tableClassName="bg-card border flex justify-center"
    />
  );
}
