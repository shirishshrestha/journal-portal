import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/features/shared";
import { BookOpen, MoreVertical, Trash2, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { statusConfig } from "../../../../shared/utils/submission-status-color";

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
    render: (row) => {
      return (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.submission_number}
            </p>
          </div>
        </div>
      );
    },
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
    key: "document_counts",
    header: "Documents",
    render: (row) => (
      <p className="text-xs text-muted-foreground">{row?.document_count}</p>
    ),
  },
  {
    key: "submitted_at",
    header: "Submission Date",
    cellClassName: "text-muted-foreground text-sm",
    render: (row) =>
      row.submitted_at
        ? format(new Date(row.submitted_at), "PPP")
        : "Not Submitted Yet",
  },
  {
    key: "updated_at",
    header: "Last Updated",
    cellClassName: "text-muted-foreground text-sm",
    render: (row) =>
      row.updated_at ? format(new Date(row.updated_at), "PPP") : "-",
  },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={row.viewUrl || "#"}
              className={"flex items-center text-sm gap-2 "}
            >
              <DropdownMenuItem>
                <Eye className=" h-4 w-4 text-foreground hover:text-primary-foreground" />
                View Submission
              </DropdownMenuItem>
            </Link>

            {row.onEdit && (
              <>
                <DropdownMenuSeparator />
                <Link
                  href={`/author/submissions/${row.id}/edit`}
                  className={"flex items-center text-sm gap-2 "}
                >
                  <DropdownMenuItem>
                    <Pencil className=" h-4 w-4 text-foreground hover:text-primary-foreground" />
                    Edit Submission
                  </DropdownMenuItem>
                </Link>
              </>
            )}

            {row.onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => row.onDelete(row)}
                  className="text-destructive group hover:text-primary-foreground"
                >
                  <Trash2 className=" h-4 w-4 text-destructive group-hover:text-primary-foreground" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export default function AuthorSubmissionsTable({
  submissions = [],
  isPending,
  error,
  onAddDocuments,
  onViewDocuments,
  onSubmit,
  onDelete,
  onEdit,
  viewUrl,
}) {
  // Attach action handlers to each submission row
  const submissionsWithActions = submissions.map((submission) => ({
    ...submission,
    onAddDocuments,
    onViewDocuments,
    onSubmit,
    onDelete,
    onEdit,
    viewUrl: typeof viewUrl === "function" ? viewUrl(submission) : viewUrl,
  }));
  return (
    <DataTable
      data={submissionsWithActions}
      columns={columns}
      emptyMessage="No submissions found"
      tableClassName="bg-card border flex justify-center"
      isPending={isPending}
      error={error}
      hoverable
    />
  );
}
