'use client';

import React from 'react';
import { useGetBadges, useGetMyBadges, useGetAwards, useGetLeaderboards, useGetMyCertificates, useGenerateAwardCertificate, useGenerateCertificatePDF } from '@/features';
import { BadgeCard, AwardCard, LeaderboardTable, CertificateGrid, LoadingScreen, ErrorCard } from '@/features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, Medal, TrendingUp, FileText } from 'lucide-react';

export default function AuthorAchievementsPage() {
  // Fetch author-specific badges (AUTHOR badge_type)
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

  // Fetch author-specific awards
  const {
    data: awardsData,
    isPending: awardsPending,
    error: awardsError,
  } = useGetAwards();

  // Fetch author leaderboards
  const {
    data: leaderboardsData,
    isPending: leaderboardsPending,
    error: leaderboardsError,
  } = useGetLeaderboards({ category: 'AUTHOR', period: 'YEARLY' });

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

  // Filter for author-specific data
  const authorBadges = badgesData?.results?.filter(badge => badge.badge_type === 'AUTHOR') || [];
  const myAuthorBadges = myBadgesData?.results?.filter(ub => ub.badge?.badge_type === 'AUTHOR') || [];
  const authorAwards = awardsData?.results?.filter(award => 
    ['RESEARCHER_OF_YEAR', 'TOP_CONTRIBUTOR', 'RISING_STAR', 'LIFETIME_ACHIEVEMENT'].includes(award.award_type)
  ) || [];
  const leaderboards = leaderboardsData?.results || [];
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
          Author Achievements
        </h1>
        <p className="text-muted-foreground mt-2">
          Your achievements and recognition as an author
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
                <div className="text-2xl font-bold">{myAuthorBadges.length}</div>
                <p className="text-xs text-muted-foreground">
                  {authorBadges.length} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authorAwards.length}</div>
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
                {myAuthorBadges.slice(0, 3).map((userBadge) => (
                  <BadgeCard key={userBadge.id} badge={userBadge.badge} earned={true} />
                ))}
                {myAuthorBadges.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No badges earned yet. Keep publishing to earn badges!
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
              <CardTitle>My Author Badges</CardTitle>
              <CardDescription>Badges you have earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myAuthorBadges.map((userBadge) => (
                  <BadgeCard key={userBadge.id} badge={userBadge.badge} earned={true} />
                ))}
                {myAuthorBadges.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No badges earned yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Author Badges</CardTitle>
              <CardDescription>Badges you can earn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {authorBadges.map((badge) => {
                  const earned = myAuthorBadges.some((ub) => ub.badge.id === badge.id);
                  return <BadgeCard key={badge.id} badge={badge} earned={earned} />;
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-6">
          {authorAwards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="w-12 h-12 mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No awards received yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {authorAwards.map((award) => (
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
              <CardDescription>Your achievement certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <CertificateGrid certificates={certificates} onGeneratePDF={handleGeneratePDF} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Author Rankings</CardTitle>
              <CardDescription>See where you stand among authors</CardDescription>
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
                    name: 'Author Rankings',
                    description: 'Top authors based on publications',
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
