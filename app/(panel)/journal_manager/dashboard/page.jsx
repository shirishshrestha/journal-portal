'use client';

import { LoadingScreen, ErrorCard, useGetMyAnalytics } from '@/features';
import {
  DashboardStatsCards,
  QuickActionsGrid,
  RoleInformationCard,
} from '@/features/panel/journal-manager';

export default function JournalManagerDashboard() {
  const {
    data: analytics,
    isPending: isAnalyticsPending,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetMyAnalytics();

  if (analyticsError) {
    return (
      <ErrorCard
        title="Failed to load dashboard"
        description={analyticsError?.message || 'Unable to fetch dashboard data'}
        onRetry={refetchAnalytics}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      {isAnalyticsPending && <LoadingScreen />}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Journal Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Manage journal settings, staff members, and organizational structure
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStatsCards
        stats={analytics?.journal_manager_stats}
        isLoading={isAnalyticsPending}
      />

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <QuickActionsGrid />
      </div>

      {/* Information Card */}
      <RoleInformationCard />
    </div>
  );
}
