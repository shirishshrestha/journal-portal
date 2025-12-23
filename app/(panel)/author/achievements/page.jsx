'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetBadges,
  useGetMyBadges,
  useGetAwards,
  useGetLeaderboards,
  useGetMyCertificates,
  useGenerateAwardCertificate,
  useGenerateCertificatePDF,
  LoadingScreen,
  ErrorCard,
  AchievementsHeader,
  OverviewTab,
  BadgesTab,
  AwardsTab,
  CertificatesTab,
  LeaderboardTab,
} from '@/features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Medal, TrendingUp, FileText } from 'lucide-react';

export default function AuthorAchievementsPage() {
  const searchParams = useSearchParams();

  // Read filters from URL params
  const searchQuery = searchParams.get('search') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedYear = searchParams.get('year') || '';
  const selectedAwardType = searchParams.get('award_type') || '';
  const leaderboardPeriod = searchParams.get('period') || 'YEARLY';

  // Generate year options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Award type options for authors
  const awardTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'RESEARCHER_OF_YEAR', label: 'Researcher of the Year' },
    { value: 'TOP_CONTRIBUTOR', label: 'Top Contributor' },
    { value: 'RISING_STAR', label: 'Rising Star' },
    { value: 'LIFETIME_ACHIEVEMENT', label: 'Lifetime Achievement' },
  ];

  // Fetch author-specific badges (AUTHOR badge_type)
  const {
    data: badgesData,
    isPending: badgesPending,
    error: badgesError,
  } = useGetBadges({
    badge_type: 'AUTHOR',
    search: searchQuery || undefined,
    level: selectedLevel || undefined,
  });

  const {
    data: myBadgesData,
    isPending: myBadgesPending,
    error: myBadgesError,
  } = useGetMyBadges({
    badge_type: 'AUTHOR',
    year: selectedYear || undefined,
  });

  // Fetch author-specific awards
  const {
    data: awardsData,
    isPending: awardsPending,
    error: awardsError,
  } = useGetAwards({
    year: selectedYear || undefined,
    award_type: selectedAwardType || undefined,
  });

  // Fetch author leaderboards
  const {
    data: leaderboardsData,
    isPending: leaderboardsPending,
    error: leaderboardsError,
  } = useGetLeaderboards({ category: 'AUTHOR', period: leaderboardPeriod });

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
  if (
    badgesPending ||
    myBadgesPending ||
    awardsPending ||
    leaderboardsPending ||
    certificatesPending
  ) {
    return <LoadingScreen />;
  }

  // Error state
  if (badgesError || myBadgesError || awardsError || leaderboardsError || certificatesError) {
    return (
      <ErrorCard
        error={
          badgesError || myBadgesError || awardsError || leaderboardsError || certificatesError
        }
        message="Failed to load achievements"
      />
    );
  }

  // Data is already filtered by backend
  const authorBadges = badgesData?.results || [];
  const myAuthorBadges = myBadgesData?.results || [];
  const authorAwards = awardsData?.results || [];
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
      <AchievementsHeader
        title="Author Achievements"
        description="Your achievements and recognition as an author"
      />

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

        <TabsContent value="overview">
          <OverviewTab
            myBadges={myAuthorBadges}
            allBadges={authorBadges}
            awards={authorAwards}
            leaderboards={leaderboards}
            emptyMessage="No badges earned yet. Keep publishing to earn badges!"
          />
        </TabsContent>

        <TabsContent value="badges">
          <BadgesTab
            allBadges={authorBadges}
            myBadges={myAuthorBadges}
            yearOptions={yearOptions}
            badgeTypeLabel="Author"
          />
        </TabsContent>

        <TabsContent value="awards">
          <AwardsTab
            awards={authorAwards}
            yearOptions={yearOptions}
            awardTypeOptions={awardTypeOptions}
            onGenerateCertificate={handleGenerateCertificate}
          />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesTab certificates={certificates} onGeneratePDF={handleGeneratePDF} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardTab
            leaderboards={leaderboards}
            period={leaderboardPeriod}
            title="Author Rankings"
            description="See where you stand among authors"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
