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
import {
  BookOpen,
  MoreVertical,
  FileUp,
  Send,
  Trash2,
  Eye,
} from "lucide-react";

const statusConfig = {
  DRAFT: {
    bg: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-900 dark:text-gray-100",
    label: "Draft",
  },
  SUBMITTED: {
    bg: "bg-blue-50 dark:bg-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    label: "Submitted",
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
  REVISED: {
    bg: "bg-indigo-100 dark:bg-indigo-900",
    text: "text-indigo-700 dark:text-indigo-300",
    label: "Revised",
  },
  ACCEPTED: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
    label: "Accepted",
  },
  REJECTED: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    label: "Rejected",
  },
  WITHDRAWN: {
    bg: "bg-gray-300 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-200",
    label: "Withdrawn",
  },
  PUBLISHED: {
    bg: "bg-emerald-100 dark:bg-emerald-900",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Published",
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
    render: (row) => {
      const router = useRouter();
      return (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => {
            if (row.status === 'DRAFT') {
              router.push(`/author/submissions/drafts/${row.id}`);
            }
          }}
        >
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
    render: (row) => {
      const router = useRouter();
      
      // For drafts, show View and Delete buttons
      if (row.status === 'DRAFT') {
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/author/submissions/drafts/${row.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => row.onDelete?.(row)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
      
      // For unassigned submissions (SUBMITTED or UNDER_REVIEW with no reviewers), show View button
      if ((row.status === 'SUBMITTED' || row.status === 'UNDER_REVIEW') && row.review_assignment_count === 0) {
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/author/submissions/unassigned/${row.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        );
      }
      
      // For other statuses, show full menu
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => row.onAddDocuments?.(row)}>
              <FileUp className="mr-2 h-4 w-4" />
              Add Documents
            </DropdownMenuItem>
            {row.document_count > 0 && (
              <DropdownMenuItem onClick={() => row.onViewDocuments?.(row)}>
                <Eye className="mr-2 h-4 w-4" />
                View Documents
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => row.onSubmit?.(row)}>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => row.onDelete?.(row)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
}) {
  // Attach action handlers to each submission row
  const submissionsWithActions = submissions.map((submission) => ({
    ...submission,
    onAddDocuments,
    onViewDocuments,
    onSubmit,
    onDelete,
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
