'use client';

import { useDashboardAnalytics } from '@/features/panel/admin/dashboard/hooks/useDashboardAnalytics';
import { Users, BookOpen, FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { ErrorCard, LoadingScreen, QuickLinksPanel, StatsCard, SystemHealth } from '@/features';
import {
  SubmissionStatusChart,
  ReviewStatusChart,
  UserDistributionChart,
  JournalDistributionChart,
} from '@/features/panel/admin/dashboard/components';

export default function AdminDashboard() {
  // Fetch analytics data from API
  const {
    data: analyticsData,
    isPending,
    isError: AnalyticsDataError,
    error,
    refetch,
  } = useDashboardAnalytics();

  const analyticsDatas = {
    overview: {
      total_submissions: 0,
      pending_submissions: 0,
      submissions_last_30_days: 0,
      acceptance_rate: 0,
      total_reviews: 0,
      pending_reviews: 0,
      avg_review_time_days: null,
    },
    submissions: {
      total: 5,
      pending: 3,
      accepted: 1,
      rejected: 1,
      under_review: 1,
    },
    reviews: {
      total: 6,
      pending: 3,
      completed: 2,
      declined: 1,
    },
    users: {
      total: 7,
      verified: 1,
      pending_verifications: 1,
      authors: 1,
      reviewers: 1,
    },
    journals: {
      total: 4,
      active: 3,
      inactive: 1,
    },
  };

  const statistics = analyticsData
    ? [
        {
          title: 'Total Submissions',
          value: analyticsData.overview.total_submissions?.toString() ?? '-',
          icon: FileText,
          valueClass: 'text-chart-1',
          iconClass: 'text-chart-1',
        },
        {
          title: 'Pending Submissions',
          value: analyticsData.overview.pending_submissions?.toString() ?? '-',
          icon: Clock,
          valueClass: 'text-chart-2',
          iconClass: 'text-chart-2',
        },
        {
          title: 'Total Reviews',
          value: analyticsData.overview.total_reviews?.toString() ?? '-',
          icon: CheckCircle,
          valueClass: 'text-chart-3',
          iconClass: 'text-chart-3',
        },
        {
          title: 'Pending Reviews',
          value: analyticsData.overview.pending_reviews?.toString() ?? '-',
          icon: XCircle,
          valueClass: 'text-chart-4',
          iconClass: 'text-chart-4',
        },
        {
          title: 'Acceptance Rate',
          value:
            analyticsData.overview.acceptance_rate != null
              ? `${analyticsData.overview.acceptance_rate}%`
              : '-',
          icon: TrendingUp,
          valueClass: 'text-chart-5',
          iconClass: 'text-chart-5',
        },
        {
          title: 'Total Users',
          value: analyticsData.users.total?.toString() ?? '-',
          icon: Users,
          valueClass: 'text-foreground',
          iconClass: 'text-foreground',
        },
        {
          title: 'Total Journals',
          value: analyticsData.journals.total?.toString() ?? '-',
          icon: BookOpen,
          valueClass: 'text-chart-3',
          iconClass: 'text-chart-3',
        },
        {
          title: 'Submissions (30d)',
          value: analyticsData.overview.submissions_last_30_days?.toString() ?? '-',
          icon: FileText,
          valueClass: 'text-secondary',
          iconClass: 'text-secondary',
        },
      ]
    : [];

  if (AnalyticsDataError) {
    return (
      <ErrorCard
        title="Failed to load admin analytics data"
        description="We couldn't load the analytics data for the admin dashboard. Please try again."
        details={error?.message || error?.toString()}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-5 ">
      {isPending && <LoadingScreen />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        </div>
        <SystemHealth />
      </div>

      {/* KPI Cards */}
      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatsCard key={`skeleton-${i}`} title="Loading..." value="-" isLoading={isPending} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {statistics.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueClass={stat.valueClass}
              iconClass={stat.iconClass}
            />
          ))}
        </div>
      )}

      {/* Analytics Charts Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-foreground">Analytics Overview</h2>

        {/* Submission and Review Status Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SubmissionStatusChart data={analyticsData?.submissions || {}} isPending={isPending} />
          <ReviewStatusChart data={analyticsData?.reviews || {}} isPending={isPending} />
        </div>

        {/* User and Journal Distribution Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <UserDistributionChart data={analyticsData?.users || {}} isPending={isPending} />
          <JournalDistributionChart data={analyticsData?.journals || {}} isPending={isPending} />
        </div>
      </div>

      {/* Recent Activity and Quick Links */}
      <div className="">
        <QuickLinksPanel />
      </div>
    </div>
  );
}
