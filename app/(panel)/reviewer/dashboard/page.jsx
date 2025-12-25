'use client';

import {
  ReviewAssignmentsTable,
  ReviewerStatsChart,
} from '@/features/panel/reviewer/components/dashboard';
import { LoadingScreen, useGetMyBadges, BadgeCard, CardSkeleton } from '@/features';
import { useGetMyAnalytics } from '@/features/shared/hooks';
import { useGetReviewAssignments } from '@/features/panel/reviewer/hooks/query/useGetReviewAssignments';
import ErrorCard from '@/features/shared/components/ErrorCard';
import StatsCard from '@/features/shared/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function ReviewerDashboard() {
  const {
    data: analytics,
    isPending: isAnalyticsPending,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetMyAnalytics();
  const {
    data: assignments,
    isPending: isAssignmentsPending,
    error: assignmentsError,
  } = useGetReviewAssignments();

  // Fetch user's badges
  const { data: myBadgesData, isPending: badgesPending } = useGetMyBadges();

  const reviewerStats = analytics?.reviewer_stats || {};
  const isLoading = isAnalyticsPending;
  const hasError = analyticsError && !analytics;

  // Event handlers for table actions
  const handleAcceptReview = (review) => {
    console.log('Accept review:', review);
    // TODO: Implement accept review logic
  };

  const handleDeclineReview = (review) => {
    console.log('Decline review:', review);
    // TODO: Implement decline review logic
  };

  const handleStartReview = (review) => {
    console.log('Start review:', review);
    // TODO: Implement start review logic
  };

  const handleDownloadFiles = (review) => {
    console.log('Download files:', review);
    // TODO: Implement download files logic
  };

  return (
    <div className="space-y-5">
      {(isAssignmentsPending || isAnalyticsPending) && <LoadingScreen />}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">Track and manage your peer review assignments</p>
      </div>

      {hasError && (
        <ErrorCard
          title="Failed to load dashboard"
          description={analyticsError?.message || 'Unable to fetch analytics data'}
          onRetry={refetchAnalytics}
        />
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          icon={FileText}
          title="Total Assignments"
          value={reviewerStats.total_assignments || 0}
          iconClass="text-blue-500"
          valueClass="text-foreground"
          isLoading={isLoading}
        />
        <StatsCard
          icon={Clock}
          title="Pending"
          value={reviewerStats.pending || 0}
          iconClass="text-amber-500"
          valueClass="text-foreground"
          isLoading={isLoading}
        />
        <StatsCard
          icon={CheckCircle2}
          title="Accepted"
          value={reviewerStats.accepted || 0}
          iconClass="text-green-500"
          valueClass="text-foreground"
          isLoading={isLoading}
        />
        <StatsCard
          icon={CheckCircle2}
          title="Completed"
          value={reviewerStats.completed || 0}
          iconClass="text-green-600"
          valueClass="text-foreground"
          isLoading={isLoading}
        />
        <StatsCard
          icon={TrendingUp}
          title="Avg. Time (Days)"
          value={
            reviewerStats.avg_completion_time_days
              ? reviewerStats.avg_completion_time_days.toFixed(1)
              : '0'
          }
          iconClass="text-purple-500"
          valueClass="text-foreground"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1">
        <ReviewerStatsChart reviewerStats={reviewerStats} isLoading={isLoading} />
      </div>

      {/* Review Assignments Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Review Assignments</h2>
        </div>
        <ReviewAssignmentsTable
          assignments={assignments || []}
          onAcceptReview={handleAcceptReview}
          onDeclineReview={handleDeclineReview}
          onStartReview={handleStartReview}
          onDownloadFiles={handleDownloadFiles}
          isPending={isAssignmentsPending}
          error={assignmentsError}
        />
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                My Achievements
              </CardTitle>
              <CardDescription>Your review badges and recognition</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/leaderboards">Leaderboards</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/achievements">View All</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {badgesPending ? (
            <CardSkeleton />
          ) : myBadgesData?.results && myBadgesData.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBadgesData.results.slice(0, 3).map((userBadge) => (
                <BadgeCard
                  key={userBadge.id}
                  badge={userBadge.badge}
                  earned={true}
                  earnedAt={userBadge.earned_at}
                  isFeatured={userBadge.is_featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No badges earned yet. Complete reviews to earn achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
