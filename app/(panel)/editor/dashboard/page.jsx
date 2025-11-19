"use client";

import {
  EditorDashboardStats,
  EditorJournalsDoughnutChart,
  EditorSubmissionsChart,
  ErrorCard,
  RoleBasedRoute,
  useGetMyAnalytics,
} from "@/features";
import React from "react";

export default function EditorDashboard() {
  const {
    data: analytics,
    isPending: isAnalyticsPending,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetMyAnalytics();

  const editorStats = analytics?.editor_stats || {};
  // For doughnut chart: expects journals, submissions_managed, decisions_made, pending_submissions

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
    <RoleBasedRoute allowedRoles={["EDITOR"]}>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Editor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track journal submissions and editorial workflow
          </p>
        </div>

        {/* Stats Cards */}
        <EditorDashboardStats counts={editorStats} isLoading={isLoading} />

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <EditorSubmissionsChart data={editorStats} isLoading={isLoading} />
          <EditorJournalsDoughnutChart
            data={editorStats}
            isLoading={isLoading}
          />
        </div>

        {/* TODO: Add tables for new submissions, journals, or other editor-specific data here */}
      </div>
    </RoleBasedRoute>
  );
}
