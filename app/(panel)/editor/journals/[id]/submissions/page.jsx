"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Loader2,
  Eye,
} from "lucide-react";
import {
  DataTable,
  ErrorCard,
  LoadingScreen,
  RoleBasedRoute,
  FilterToolbar,
  StatusBadge,
  statusConfig,
} from "@/features/shared";
import { format } from "date-fns";
import {
  useGetJournalById,
  useGetJournalSubmissions,
} from "@/features/panel/admin/journal";

export default function JournalSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.id;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch journal details using custom hook
  const {
    data: journal,
    isPending: isJournalPending,
    error: journalError,
  } = useGetJournalById(journalId);

  // Fetch submissions for this journal using custom hook
  const {
    data: submissionsData,
    isPending: isSubmissionsPending,
    error: submissionsError,
  } = useGetJournalSubmissions(journalId, {
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const submissions = submissionsData?.results || [];

  // Filter submissions by search term
  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.title?.toLowerCase().includes(searchLower) ||
      submission.submission_number?.toLowerCase().includes(searchLower) ||
      submission.corresponding_author_name?.toLowerCase().includes(searchLower)
    );
  });

  // Status badge colors
  const statusColors = {
    DRAFT: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
    SUBMITTED: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    UNDER_REVIEW:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
    REVISION_REQUESTED:
      "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    ACCEPTED:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
    REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
    WITHDRAWN:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    PUBLISHED:
      "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100",
  };

  const columns = [
    {
      key: "submission_number",
      header: "Submission #",
      cellClassName: "font-medium",
    },
    {
      key: "title",
      header: "Title",
      cellClassName: "font-medium max-w-md truncate",
    },
    {
      key: "corresponding_author_name",
      header: "Author",
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {row.corresponding_author_name || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "submitted_at",
      header: "Submitted",
      render: (row) =>
        row.submitted_at ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(row.submitted_at), "MMM d, yyyy")}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Not submitted</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status} statusConfig={statusConfig} />
      ),
    },
    {
      key: "review_count",
      header: "Reviews",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/editor/submissions/${row.id}/reviews`)}
          disabled={!row.review_count || row.review_count === 0}
        >
          <Eye className="h-4 w-4 mr-2" />
          {row.review_count || 0}
        </Button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/editor/submissions/${row.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (journalError) {
    return (
      <RoleBasedRoute allowedRoles={["EDITOR"]}>
        <ErrorCard
          title="Failed to load journal submissions"
          description={error.message}
          onBack={() => router.push("/editor/journals")}
        />
      </RoleBasedRoute>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={["EDITOR"]}>
      <div className="space-y-6">
        {/* Header */}
        {isJournalPending && <LoadingScreen />}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className={"hover:text-primary-foreground"}
                onClick={() => router.push("/editor/journals")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {journal?.title}
            </h1>
            <p className="text-muted-foreground">
              View and manage all submissions for this journal
            </p>
          </div>
        </div>

        {/* Journal Info Card */}
        <Card className={"gap-3"}>
          <CardHeader>
            <CardTitle>Journal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Short Name</p>
                <p className="font-medium">{journal?.short_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publisher</p>
                <p className="font-medium">{journal?.publisher || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Submissions
                </p>
                <p className="font-medium text-2xl">
                  {filteredSubmissions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={
                    journal?.is_active
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                  }
                >
                  {journal?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground ">
            Submissions
          </h2>
          {/* Filters */}
          <FilterToolbar>
            <FilterToolbar.Search
              paramName="search"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by title, number, or author..."
              label="Search Submissions"
            />
            <FilterToolbar.Select
              paramName="status"
              value={statusFilter}
              onChange={setStatusFilter}
              label="Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "SUBMITTED", label: "Submitted" },
                { value: "UNDER_REVIEW", label: "Under Review" },
                { value: "REVISION_REQUESTED", label: "Revision Requested" },
                { value: "ACCEPTED", label: "Accepted" },
                { value: "REJECTED", label: "Rejected" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
          </FilterToolbar>
          <DataTable
            data={filteredSubmissions}
            columns={columns}
            emptyMessage="No submissions found for this journal"
            isPending={isSubmissionsPending}
            error={submissionsError}
            errorMessage="Error loading submissions"
            hoverable={true}
            tableClassName="bg-card border flex justify-center"
          />
        </div>
      </div>
    </RoleBasedRoute>
  );
}
