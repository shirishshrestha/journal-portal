'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  useGetMyBadges,
  BadgeCard,
  CardSkeleton,
} from '@/features';
import { Plus, Trophy } from 'lucide-react';
import Link from 'next/link';

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

  // Fetch user's badges
  const { data: myBadgesData, isPending: badgesPending } = useGetMyBadges();

  const authorStats = analytics?.author_stats || {};
  const isLoading = isAnalyticsPending;
  const hasError = analyticsError && !analytics;

  if (hasError) {
    return (
      <ErrorCard
        title="Failed to load dashboard"
        description={analyticsError?.message || 'Unable to fetch analytics data'}
        onRetry={refetchAnalytics}
      />
    );
  }

  return (
    <div className="space-y-5">
      {(isAnalyticsPending || isSubmissionsPending) && <LoadingScreen />}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Author Dashboard</h1>
        <p className="text-muted-foreground">Manage and track your manuscript submissions</p>
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
          <h2 className="text-xl font-semibold">Recent Submissions</h2>
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

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                My Achievements
              </CardTitle>
              <CardDescription>Your recent badges and accomplishments</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/achievements">View All</Link>
            </Button>
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
              <p>No badges earned yet. Keep publishing to earn achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
