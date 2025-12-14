"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FilterToolbar,
  StatusBadge,
  statusConfig,
  Pagination,
  ConfirmationPopup,
  useToggle,
} from "@/features/shared";
import { format } from "date-fns";
import {
  useGetJournalById,
  useGetJournalSubmissions,
} from "@/features/panel/editor/journal";
import { JournalInfoCard, OJSSyncingDialog } from "@/features";
import { useImportFromOJS } from "@/features/panel/editor/journal/hooks/mutation/useImportFromOJS";
import { useImportProgress } from "@/features/panel/editor/journal/hooks/query/useImportProgress";
import { RefreshCw } from "lucide-react";
import EllipsisTooltip from "@/components/ui/EllipsisTooltip";

/**
 * JournalSubmissionsPage component displays and manages the list of submissions for a specific journal.
 *
 * Features:
 * - Fetches and displays journal details and submissions using provided hooks.
 * - Supports searching, filtering by status, and pagination of submissions.
 * - Allows syncing submissions from Open Journal Systems (OJS) with progress tracking.
 * - Handles loading and error states for both journal and submissions data.
 * - Provides actions to view submission details and reviews.
 *
 * UI Elements:
 * - Journal information card.
 * - Submissions data table with columns for submission number, title, author, submission date, status, reviews, and actions.
 * - Filter toolbar for searching and filtering submissions.
 * - Pagination controls.
 * - Sync from OJS and import progress dialogs.
 *
 * @component
 * @returns {JSX.Element} The rendered JournalSubmissionsPage component.
 */
export default function JournalSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const [isSyncDialogOpen, toggleSyncDialog] = useToggle(false);
  const [isViewProgressOpen, toggleViewProgress] = useToggle(false);

  const submissionParams = {
    search: search,
    page: currentPage,
    status: statusParam,
  };

  const journalId = params.id;

  const {
    data: journal,
    isPending: isJournalPending,
    error: journalError,
  } = useGetJournalById(journalId);

  console.log(journalError);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const {
    data: submissionsData,
    isPending: isSubmissionsPending,
    error: submissionsError,
    refetch,
  } = useGetJournalSubmissions(journalId, { params: submissionParams });

  const importMutation = useImportFromOJS();

  const { progressData, isPolling, startPolling, isWaitingForStart } =
    useImportProgress(journalId);

  const isImportActive =
    progressData?.status !== "idle" &&
    progressData?.status !== "completed" &&
    progressData?.status !== "error";

  const handleSyncFromOJS = () => {
    importMutation.mutate(journalId, {
      onSuccess: () => {
        // Start polling after import is initiated
        startPolling();
      },
    });
  };

  const handleViewProgress = () => {
    if (!isPolling) {
      startPolling();
    }
    toggleViewProgress();
  };

  // Close sync dialog when import actually starts (status changes from idle)
  useEffect(() => {
    if (isWaitingForStart && progressData.status !== "idle") {
      toggleSyncDialog();
    }
  }, [isWaitingForStart, progressData.status, toggleSyncDialog]);

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
        title="Failed to load journal details"
        description={
          journalError?.message ||
          journalError?.toString() ||
          "Error loading journal details."
        }
        onBack={() => router.push("/editor/journals")}
      />
    );
  }

  if (submissionsError) {
    return (
      <ErrorCard
        title="Failed to load submissions"
        description={
          submissionsError?.message ||
          submissionsError?.toString() ||
          "Error loading submissions."
        }
        onRetry={refetch()}
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
              onClick={() => router.push("/editor/journals")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">
            {journal?.title}
          </h1>
          <p className="text-muted-foreground">
            View and manage all submissions for this journal
          </p>
        </div>
        {/* {journal?.ojs_connection_status?.connected && ( */}
        <>
          {!isImportActive ? (
            <>
              <Button
                onClick={toggleSyncDialog}
                disabled={importMutation.isPending || isPolling}
                variant="secondary"
                size="sm"
              >
                {importMutation.isPending || isPolling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync from OJS
                  </>
                )}
              </Button>
              <ConfirmationPopup
                open={isSyncDialogOpen}
                onOpenChange={(open) => {
                  // Only allow closing if not waiting for import to start
                  if (!isWaitingForStart) {
                    toggleSyncDialog();
                  }
                }}
                title="Sync Submissions from OJS"
                description="This will import and update submissions from Open Journal Systems (OJS) for this journal. Are you sure you want to continue?"
                confirmText="Sync Now"
                cancelText="Cancel"
                variant="primary"
                onConfirm={handleSyncFromOJS}
                isPending={importMutation.isPending || isWaitingForStart}
                loadingText={
                  isWaitingForStart
                    ? "Waiting for import to start..."
                    : "Starting import..."
                }
                autoClose={false}
              />
            </>
          ) : (
            <Button onClick={handleViewProgress} variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Import Status
            </Button>
          )}
        </>
        {/* )} */}
      </div>

      {/* Journal Info Card */}
      <Card className={"gap-3"}>
        <CardHeader>
          <CardTitle>Journal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalInfoCard journal={journal} isPending={isJournalPending} />
        </CardContent>
      </Card>

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
              ...Object.entries(statusConfig).map(([value, { label }]) => ({
                value,
                label,
              })),
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

        <OJSSyncingDialog
          open={isViewProgressOpen}
          onOpenChange={toggleViewProgress}
          progress={progressData?.percentage || 0}
          progressData={progressData}
        />
      </div>
    </div>
  );
}
