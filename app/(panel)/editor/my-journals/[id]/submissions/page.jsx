"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, User, Eye } from "lucide-react";
import {
  DataTable,
  ErrorCard,
  LoadingScreen,
  FilterToolbar,
  StatusBadge,
  statusConfig,
  Pagination,
} from "@/features/shared";
import { format } from "date-fns";
import {
  useGetJournalById,
  useGetJournalSubmissions,
} from "@/features/panel/editor/journal";
import { JournalInfoCard } from "@/features";
import EllipsisTooltip from "@/components/ui/EllipsisTooltip";
import { Badge } from "@/components/ui/badge";

export default function MyJournalSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const submissionParams = {
    search: search,
    status: statusParam && statusParam !== "all" ? statusParam : undefined,
    page: currentPage,
  };

  const journalId = params.id;

  // Fetch journal details
  const {
    data: journal,
    isPending: isJournalPending,
    error: journalError,
  } = useGetJournalById(journalId);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch submissions for this journal
  const {
    data: submissionsData,
    isPending: isSubmissionsPending,
    error: submissionsError,
  } = useGetJournalSubmissions(journalId, { params: submissionParams });

  // Get current user's role in this journal
  const myRole = journal?.staff_members?.find((staff) => staff.is_current_user);

  const getRoleBadgeColor = (role) => {
    const colors = {
      EDITOR_IN_CHIEF: "bg-purple-100 text-purple-800 border-purple-200",
      MANAGING_EDITOR: "bg-blue-100 text-blue-800 border-blue-200",
      ASSOCIATE_EDITOR: "bg-cyan-100 text-cyan-800 border-cyan-200",
      SECTION_EDITOR: "bg-green-100 text-green-800 border-green-200",
      GUEST_EDITOR: "bg-yellow-100 text-yellow-800 border-yellow-200",
      REVIEWER: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
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
          <EllipsisTooltip text={row.corresponding_author_name || "-"} />
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
      <ErrorCard
        title="Failed to load journal"
        description={
          journalError?.message ||
          "Unable to load journal details. Please try again."
        }
        onBack={() => router.push("/editor/my-journals")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {isJournalPending && <LoadingScreen />}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className={"hover:text-primary-foreground"}
              onClick={() => router.push("/editor/my-journals")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Journals
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {journal?.title}
            </h1>
            {myRole && (
              <Badge
                variant="outline"
                className={getRoleBadgeColor(myRole.role)}
              >
                {myRole.role_display}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            View and manage submissions for this journal
          </p>
        </div>
      </div>

      {/* Journal Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalInfoCard journal={journal} isPending={isJournalPending} />
        </CardContent>
      </Card>

      {/* Submissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Submissions</h2>
        </div>

        {/* Filters */}
        <FilterToolbar>
          <FilterToolbar.Search
            paramName="search"
            placeholder="Search by title, number, or author..."
            label="Search Submissions"
          />
          <FilterToolbar.Select
            paramName="status"
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
          data={submissionsData?.results || []}
          columns={columns}
          emptyMessage="No submissions found for this journal"
          isPending={isSubmissionsPending}
          error={submissionsError}
          errorMessage="Error loading submissions"
          hoverable={true}
          tableClassName="bg-card border flex justify-center"
        />

        {submissionsData && submissionsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(submissionsData.count / 10)}
            totalCount={submissionsData.count}
            pageSize={10}
            onPageChange={handlePageChange}
            showPageSizeSelector={false}
          />
        )}
      </div>
    </div>
  );
}
