'use client';

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  useGetBadges,
  useGetMyBadges,
  useGetAwards,
  useGetTopReviewers,
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

export default function ReviewerAchievementsPage() {
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
      params.delete('page');

      params.delete('award_type');
      params.delete('year');
      params.delete('period');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate year options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Award type options for reviewers
  const awardTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'BEST_REVIEWER', label: 'Best Reviewer' },
    { value: 'EXCELLENCE_REVIEW', label: 'Excellence in Review' },
    { value: 'TOP_CONTRIBUTOR', label: 'Top Contributor' },
  ];

  // Fetch reviewer-specific badges (REVIEWER badge_type) - backend will filter
  const {
    data: badgesData,
    isPending: badgesPending,
    error: badgesError,
  } = useGetBadges({
    badge_type: 'REVIEWER',
    search: searchQuery || undefined,
    level: selectedLevel || undefined,
  });

  const {
    data: myBadgesData,
    isPending: myBadgesPending,
    error: myBadgesError,
  } = useGetMyBadges({
    badge_type: 'REVIEWER',
    year: selectedYear || undefined,
  });

  // Fetch reviewer-specific awards - backend will filter
  const {
    data: awardsData,
    isPending: awardsPending,
    error: awardsError,
  } = useGetAwards({
    award_type: selectedAwardType || 'BEST_REVIEWER,EXCELLENCE_REVIEW,TOP_CONTRIBUTOR',
    year: selectedYear || undefined,
  });

  // Fetch reviewer leaderboards
  const {
    data: topReviewersData,
    isPending: leaderboardsPending,
    error: leaderboardsError,
  } = useGetTopReviewers({
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
  const reviewerBadges = badgesData?.results || [];
  const myReviewerBadges = myBadgesData?.results || [];
  const reviewerAwards = awardsData?.results || [];
  const leaderboards = topReviewersData?.data || [];
  const certificates = certificatesData?.results || [];

  // Extract pagination info for leaderboard
  const leaderboardTotalCount = topReviewersData?.count || 0;
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
        title="Reviewer Achievements"
        description="Your achievements and recognition as a reviewer"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
            myBadges={myReviewerBadges}
            allBadges={reviewerBadges}
            awards={reviewerAwards}
            leaderboards={leaderboards}
            emptyMessage="No badges earned yet. Complete reviews to earn badges!"
          />
        </TabsContent>

        <TabsContent value="badges">
          <BadgesTab
            allBadges={reviewerBadges}
            myBadges={myReviewerBadges}
            yearOptions={yearOptions}
            badgeTypeLabel="Reviewer"
          />
        </TabsContent>

        <TabsContent value="awards">
          <AwardsTab
            awards={reviewerAwards}
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
            title="Reviewer Rankings"
            description="See where you stand among reviewers"
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
