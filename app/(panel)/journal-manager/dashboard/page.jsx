'use client';

import { LoadingScreen, ErrorCard } from '@/features';
import {
  DashboardStatsCards,
  QuickActionsGrid,
  RoleInformationCard,
  useGetJournals,
} from '@/features/panel/journal-manager';

export default function JournalManagerDashboard() {
  const {
    data: journals,
    isPending: isLoadingJournals,
    isError,
    error,
    refetch,
  } = useGetJournals();

  if (isError) {
    return (
      <ErrorCard
        title="Failed to load dashboard"
        description={error?.message || 'Unable to fetch dashboard data'}
        onRetry={refetch}
      />
    );
  }

  if (isLoadingJournals) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Journal Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Manage journal settings, staff members, and organizational structure
        </p>
      </div>

      {/* Stats Grid */}
      {/* <DashboardStatsCards stats={stats} isLoading={isLoadingJournals} /> */}

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
