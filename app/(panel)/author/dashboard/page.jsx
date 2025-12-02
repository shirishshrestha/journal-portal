"use client";

import { Button } from "@/components/ui/button";
import {
  AuthorDashboardStats,
  AuthorDashboardTable,
  AuthorDoughnutChart,
  AuthorSubmissionsChart,
  ErrorCard,
  LoadingScreen,
  RoleBasedRoute,
  useGetMyAnalytics,
  useGetSubmissions,
} from "@/features";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AuthorDashboard() {
  const {
    data: analytics,
    isPending: isAnalyticsPending,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetMyAnalytics();
  const {
    data: submissions,
    isPending: isSubmissionsPending,
    error: submissionsError,
  } = useGetSubmissions();

  const authorStats = analytics?.author_stats || {};
  const isLoading = isAnalyticsPending;
  const hasError = analyticsError && !analytics;

  if (hasError) {
    return (
      <ErrorCard
        title="Failed to load dashboard"
        description={
          analyticsError?.message || "Unable to fetch analytics data"
        }
        onRetry={refetchAnalytics}
      />
    );
  }

  return (
    <div className="space-y-5">
      {(isAnalyticsPending || isSubmissionsPending) && <LoadingScreen />}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Author Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track your manuscript submissions
        </p>
      </div>

      {/* Stats Cards */}
      <AuthorDashboardStats
        counts={{
          draft: authorStats.draft || 0,
          underReview: authorStats.under_review || 0,
          rejected: authorStats.rejected || 0,
          accepted: authorStats.accepted || 0,
          pending: authorStats.pending || 0,
        }}
        isLoading={isLoading}
        isError={hasError}
        error={analyticsError}
      />

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <AuthorSubmissionsChart data={authorStats} isLoading={isLoading} />
        <AuthorDoughnutChart data={authorStats} isLoading={isLoading} />
      </div>

      {/* Submissions Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Submissions</h2>
          <Link href="/author/new-submission">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </Button>
          </Link>
        </div>

        <AuthorDashboardTable
          submissions={submissions?.results || []}
          isPending={isSubmissionsPending}
          error={submissionsError}
        />

        <Link href="/author/submissions/drafts/">
          <Button variant="secondary" size="md" className="">
            View All Submissions
          </Button>
        </Link>
      </div>
    </div>
  );
}
