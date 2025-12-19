'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorCard } from '@/features';
import { JournalsTable, useGetJournals } from '@/features/panel/journal-manager';
import { FilterToolbar, Pagination } from '@/features/shared';

export default function JournalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status');

  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const is_active = statusParam === 'active' ? true : statusParam === 'inactive' ? false : '';

  const params = {
    search: searchParam || '',
    is_active: is_active,
    page: currentPage,
  };

  const {
    data: journals,
    isPending: isLoading,
    isError,
    error,
    refetch,
  } = useGetJournals({ params });

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Journal Management</h1>
          <p className="text-muted-foreground">
            View and manage journal settings and configurations
          </p>
        </div>
        <ErrorCard
          title="Failed to load journals"
          description={error?.message || 'Unable to fetch journals'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Journal Management</h1>
        <p className="text-muted-foreground">View and manage journal settings and configurations</p>
      </div>

      <h2 className="font-semibold text-xl mb-2">Journals</h2>

      {/* Filters */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search by name, abbreviation, or ISSN..."
          label="Search"
        />

        <FilterToolbar.Select
          label="Status"
          paramName="status"
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </FilterToolbar>

      {/* Journals Table placed outside the Card */}
      <div>
        <JournalsTable journals={journals?.results || []} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {journals && journals.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(journals.count / 10)}
          totalCount={journals.count}
          pageSize={10}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', page.toString());
            router.push(`?${params.toString()}`, { scroll: false });
          }}
          showPageSizeSelector={false}
        />
      )}
    </div>
  );
}
