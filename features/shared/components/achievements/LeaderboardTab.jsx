'use client';

import React from 'react';
import { FilterToolbar } from '@/features';
import { LeaderboardTable } from './LeaderboardTable';
import Pagination from '@/features/shared/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LeaderboardTab({
  leaderboards,
  period,
  title = 'Rankings',
  description = 'See where you stand',
  totalPages = 1,
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Period Selector using FilterToolbar */}
      <FilterToolbar>
        <FilterToolbar.Select
          label="Leaderboard Period"
          paramName="period"
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'QUARTERLY', label: 'Quarterly' },
            { value: 'YEARLY', label: 'Yearly' },
          ]}
        />
      </FilterToolbar>

      <LeaderboardTable
        leaderboard={{
          name: `${title} - ${period.replace('_', ' ')}`,
          description: description,
          period: period.toLowerCase(),
          data: leaderboards,
        }}
        showPeriod={true}
      />
      {totalCount > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showPageSizeSelector={false}
          />
        </div>
      )}
    </div>
  );
}
