"use client";

import { Button } from "@/components/ui/button";
import { AuthorDashboardTable, RoleBasedRoute } from "@/features";
import AuthorSubmissionsChart from "@/features/panel/author/components/dashboard/AuthorSubmissionsChart";
import { useGetMyAnalytics } from "@/features/shared/hooks";
import { useGetSubmissions } from "@/features/panel/author/hooks/query/useGetSubmissions";
import StatsCard from "@/features/shared/components/StatsCard";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import ErrorCard from "@/features/shared/components/ErrorCard";

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
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your manuscript submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={FileText}
            title="Total Submissions"
            value={authorStats.total_submissions || 0}
            iconClass="text-blue-500"
            valueClass="text-foreground"
            isLoading={isLoading}
          />
          <StatsCard
            icon={Clock}
            title="Under Review"
            value={authorStats.under_review || 0}
            iconClass="text-amber-500"
            valueClass="text-foreground"
            isLoading={isLoading}
          />
          <StatsCard
            icon={CheckCircle}
            title="Accepted"
            value={authorStats.accepted || 0}
            iconClass="text-green-500"
            valueClass="text-foreground"
            isLoading={isLoading}
          />
          <StatsCard
            icon={XCircle}
            title="Rejected"
            value={authorStats.rejected || 0}
            iconClass="text-red-500"
            valueClass="text-foreground"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <AuthorSubmissionsChart data={authorStats} isLoading={isLoading} />
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

          <Link href="/author/submissions/">
            <Button variant="secondary" size="lg" className="">
              View All Submissions
            </Button>
          </Link>
        </div>
      </div>
    </RoleBasedRoute>
  );
}
