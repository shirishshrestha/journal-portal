'use client';

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();

  // Read active tab and filters from URL params
  const activeTab = searchParams.get('tab') || 'overview';
  const searchQuery = searchParams.get('search') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedYear = searchParams.get('year') || '';
  const selectedAwardType = searchParams.get('award_type') || '';
  const leaderboardPeriod = searchParams.get('period') || 'YEARLY';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // Handle tab change and clear irrelevant filters
  const handleTabChange = (newTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);

    // Clear filters that don't belong to the new tab
    if (newTab === 'overview') {
      // Keep all filters for overview
      params.delete('page');
    } else if (newTab === 'badges') {
      // Keep only badges-related filters
      params.delete('award_type');
      params.delete('period');
      params.delete('page');
    } else if (newTab === 'awards') {
      // Keep only awards-related filters
      params.delete('level');
      params.delete('search');
      params.delete('period');
      params.delete('page');
    } else if (newTab === 'leaderboard') {
      // Keep only leaderboard-related filters
      params.delete('level');
      params.delete('search');
      params.delete('award_type');
      params.delete('year');
    } else if (newTab === 'certificates') {
      // No filters for certificates
      params.delete('level');
      params.delete('search');
      params.delete('award_type');
      params.delete('year');
      params.delete('period');
      params.delete('page');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

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
  } = useGetLeaderboards({
    category: 'AUTHOR',
    period: leaderboardPeriod,
    page: currentPage,
  });

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

  // Extract pagination info for leaderboard
  const leaderboardTotalCount = leaderboardsData?.count || 0;
  const leaderboardPageSize = 10; // Default page size
  const leaderboardTotalPages = Math.ceil(leaderboardTotalCount / leaderboardPageSize);

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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6 ">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-full ">
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
            totalPages={leaderboardTotalPages}
            currentPage={currentPage}
            totalCount={leaderboardTotalCount}
            pageSize={leaderboardPageSize}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
