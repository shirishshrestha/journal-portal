"use client";

import { useState } from "react";
import { useDashboardAnalytics } from "@/features/panel/admin/dashboard/hooks/useDashboardAnalytics";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import {
  QuickLinksPanel,
  RecentActivityFeed,
  RoleBasedRoute,
  StatsCard,
  StatsErrorCard,
} from "@/features";
import {
  SubmissionStatusChart,
  ReviewStatusChart,
  UserDistributionChart,
  JournalDistributionChart,
} from "@/features/panel/admin/dashboard/components";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("30d");

  // Fetch analytics data from API
  const {
    data: analyticsData,
    isPending,
    isError,
    error,
  } = useDashboardAnalytics();

  const statistics = analyticsData
    ? [
        {
          title: "Total Submissions",
          value: analyticsData.overview.total_submissions?.toString() ?? "-",
          icon: FileText,
          valueClass: "text-chart-1",
          iconClass: "text-chart-1",
        },
        {
          title: "Pending Submissions",
          value: analyticsData.overview.pending_submissions?.toString() ?? "-",
          icon: Clock,
          valueClass: "text-chart-2",
          iconClass: "text-chart-2",
        },
        {
          title: "Total Reviews",
          value: analyticsData.overview.total_reviews?.toString() ?? "-",
          icon: CheckCircle,
          valueClass: "text-chart-3",
          iconClass: "text-chart-3",
        },
        {
          title: "Pending Reviews",
          value: analyticsData.overview.pending_reviews?.toString() ?? "-",
          icon: XCircle,
          valueClass: "text-chart-4",
          iconClass: "text-chart-4",
        },
        {
          title: "Acceptance Rate",
          value:
            analyticsData.overview.acceptance_rate != null
              ? `${analyticsData.overview.acceptance_rate}%`
              : "-",
          icon: TrendingUp,
          valueClass: "text-chart-5",
          iconClass: "text-chart-5",
        },
        {
          title: "Total Users",
          value: analyticsData.users.total?.toString() ?? "-",
          icon: Users,
          valueClass: "text-foreground",
          iconClass: "text-foreground",
        },
        {
          title: "Total Journals",
          value: analyticsData.journals.total?.toString() ?? "-",
          icon: BookOpen,
          valueClass: "text-chart-3",
          iconClass: "text-chart-3",
        },
        {
          title: "Submissions (30d)",
          value:
            analyticsData.overview.submissions_last_30_days?.toString() ?? "-",
          icon: FileText,
          valueClass: "text-secondary",
          iconClass: "text-secondary",
        },
      ]
    : [];

  return (
    <RoleBasedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-5 ">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        {/* KPI Cards */}
        {isError ? (
          <StatsErrorCard
            title="Failed to load admin stats"
            message={
              error?.message ||
              "An error occurred while loading admin statistics."
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                valueClass={stat.valueClass}
                iconClass={stat.iconClass}
                isLoading={isPending}
              />
            ))}
          </div>
        )}

        {/* Analytics Charts Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Analytics Overview
          </h2>

          {/* Submission and Review Status Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SubmissionStatusChart data={analyticsData?.submissions || {}} />
            <ReviewStatusChart data={analyticsData?.reviews || {}} />
          </div>

          {/* User and Journal Distribution Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserDistributionChart data={analyticsData?.users || {}} />
            <JournalDistributionChart data={analyticsData?.journals || {}} />
          </div>
        </div>

        {/* Trends Section
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Trends</h2>
            <div className="flex gap-2">
              {["7d", "30d"].map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange(range)}
                >
                  {range === "7d" ? "7 Days" : "30 Days"}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserGrowthChart dateRange={dateRange} />
            <SubmissionTrendsChart dateRange={dateRange} />
          </div>
        </div> */}

        {/* Recent Activity and Quick Links */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivityFeed />
          </div>
          <QuickLinksPanel />
        </div>
      </div>
    </RoleBasedRoute>
  );
}
