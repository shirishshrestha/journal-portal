'use client';

import React from 'react';
import { useGetBadges, useGetMyBadges, useGetAwards, useGetTopReviewers, useGetMyCertificates, useGenerateAwardCertificate, useGenerateCertificatePDF } from '@/features';
import { BadgeCard, AwardCard, LeaderboardTable, CertificateGrid, LoadingScreen, ErrorCard } from '@/features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, Medal, TrendingUp, FileText } from 'lucide-react';

export default function ReviewerAchievementsPage() {
  // Fetch reviewer-specific badges (REVIEWER badge_type)
  const {
    data: badgesData,
    isPending: badgesPending,
    error: badgesError,
  } = useGetBadges();

  const {
    data: myBadgesData,
    isPending: myBadgesPending,
    error: myBadgesError,
  } = useGetMyBadges();

  // Fetch reviewer-specific awards
  const {
    data: awardsData,
    isPending: awardsPending,
    error: awardsError,
  } = useGetAwards();

  // Fetch reviewer leaderboards
  const {
    data: topReviewersData,
    isPending: leaderboardsPending,
    error: leaderboardsError,
  } = useGetTopReviewers({ period: 'YEARLY' });

  // Fetch certificates
  const {
    data: certificatesData,
    isPending: certificatesPending,
    error: certificatesError,
  } = useGetMyCertificates();

  // Certificate generation
  const generateCertificate = useGenerateAwardCertificate();
  const generatePDF = useGenerateCertificatePDF();

  // Loading state
  if (badgesPending || myBadgesPending || awardsPending || leaderboardsPending || certificatesPending) {
    return <LoadingScreen />;
  }

  // Error state
  if (badgesError || myBadgesError || awardsError || leaderboardsError || certificatesError) {
    return (
      <ErrorCard
        error={badgesError || myBadgesError || awardsError || leaderboardsError || certificatesError}
        message="Failed to load achievements"
      />
    );
  }

  // Filter for reviewer-specific data
  const reviewerBadges = badgesData?.results?.filter(badge => badge.badge_type === 'REVIEWER') || [];
  const myReviewerBadges = myBadgesData?.results?.filter(ub => ub.badge?.badge_type === 'REVIEWER') || [];
  const reviewerAwards = awardsData?.results?.filter(award => 
    ['BEST_REVIEWER', 'EXCELLENCE_REVIEW', 'TOP_CONTRIBUTOR'].includes(award.award_type)
  ) || [];
  const leaderboards = topReviewersData?.data || [];
  const certificates = certificatesData?.results || [];

  const handleGenerateCertificate = (awardId) => {
    generateCertificate.mutate(awardId);
  };

  const handleGeneratePDF = (certificateId) => {
    generatePDF.mutate(certificateId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Reviewer Achievements
        </h1>
        <p className="text-muted-foreground mt-2">
          Your achievements and recognition as a reviewer
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="awards" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Awards
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
                <Medal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myReviewerBadges.length}</div>
                <p className="text-xs text-muted-foreground">
                  {reviewerBadges.length} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewerAwards.length}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime achievements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leaderboards.find(lb => lb.profile?.id)?.rank || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current position
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Badges</CardTitle>
              <CardDescription>Your latest achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myReviewerBadges.slice(0, 3).map((userBadge) => (
                  <BadgeCard key={userBadge.id} badge={userBadge.badge} earned={true} />
                ))}
                {myReviewerBadges.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No badges earned yet. Complete reviews to earn badges!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Reviewer Badges</CardTitle>
              <CardDescription>Badges you have earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myReviewerBadges.map((userBadge) => (
                  <BadgeCard key={userBadge.id} badge={userBadge.badge} earned={true} />
                ))}
                {myReviewerBadges.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No badges earned yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Reviewer Badges</CardTitle>
              <CardDescription>Badges you can earn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviewerBadges.map((badge) => {
                  const earned = myReviewerBadges.some((ub) => ub.badge.id === badge.id);
                  return <BadgeCard key={badge.id} badge={badge} earned={earned} />;
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-6">
          {reviewerAwards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No awards received yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviewerAwards.map((award) => (
                <AwardCard key={award.id} award={award} onGenerateCertificate={handleGenerateCertificate} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>
                Your achievement certificates with verification codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No certificates yet. Earn awards to receive certificates!
                </p>
              ) : (
                <CertificateGrid certificates={certificates} onGeneratePDF={handleGeneratePDF} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Rankings</CardTitle>
              <CardDescription>See where you stand among reviewers</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No leaderboard data available</p>
                </div>
              ) : (
                <LeaderboardTable 
                  leaderboard={{
                    name: 'Reviewer Rankings',
                    description: 'Top reviewers based on reviews completed',
                    period: 'yearly',
                    data: leaderboards
                  }} 
                  showPeriod={false} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
