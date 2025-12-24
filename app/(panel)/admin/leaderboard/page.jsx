'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FilterToolbar,
  useGetLeaderboards,
  useUpdateLeaderboards,
  ConfirmationPopup,
} from '@/features/shared';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import Pagination from '@/features/shared/components/Pagination';
import AdminLeaderboardTable from '@/features/panel/admin/components/leaderboard/AdminLeaderboardTable';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminLeaderboardPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category' || 'AUTHOR');
  const periodParam = searchParams.get('period');
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const params = {
    category: categoryParam || 'AUTHOR',
    period: periodParam || '',
    page: currentPage,
  };

  const {
    data: leaderboardData,
    isPending: isLeaderboardPending,
    error: leaderboardError,
  } = useGetLeaderboards(params);

  const updateLeaderboardsMutation = useUpdateLeaderboards({
    onSuccess: (data) => {
      toast.success(
        `Leaderboards updated successfully! Created ${data.result?.total || 0} entries.`
      );
      queryClient.invalidateQueries({ queryKey: ['leaderboards'] });
      setUpdateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update leaderboards: ${error.message}`);
      setUpdateDialogOpen(false);
    },
  });

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleUpdateLeaderboards = () => {
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = () => {
    updateLeaderboardsMutation.mutate();
  };

  const leaderboards = leaderboardData?.results || [];
  const totalCount = leaderboardData?.count || 0;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Leaderboard Management</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage reviewer and author rankings. Update leaderboards to recalculate
            rankings.
          </p>
        </div>
        <Button
          onClick={handleUpdateLeaderboards}
          disabled={updateLeaderboardsMutation.isPending}
          className="gap-2 w-fit"
        >
          <RefreshCw
            className={`h-4 w-4 ${updateLeaderboardsMutation.isPending ? 'animate-spin' : ''}`}
          />
          {updateLeaderboardsMutation.isPending ? 'Updating...' : 'Update Leaderboards'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Entries</div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Reviewer Rankings</div>
          <div className="text-2xl font-bold">
            {leaderboards.filter((l) => l.category === 'REVIEWER').length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Author Rankings</div>
          <div className="text-2xl font-bold">
            {leaderboards.filter((l) => l.category === 'AUTHOR').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterToolbar>
        <FilterToolbar.Select
          label="Category"
          paramName="category"
          options={[
            { value: 'REVIEWER', label: 'Reviewers' },
            { value: 'AUTHOR', label: 'Authors' },
          ]}
        />
        <FilterToolbar.Select
          label="Period"
          paramName="period"
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'QUARTERLY', label: 'Quarterly' },
            { value: 'YEARLY', label: 'Yearly' },
          ]}
          defaultValue=""
        />
      </FilterToolbar>

      {/* Leaderboard Table */}
      <AdminLeaderboardTable
        leaderboards={leaderboards}
        isPending={isLeaderboardPending}
        error={leaderboardError}
      />

      {/* Pagination */}
      {leaderboardData && leaderboardData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}

      {/* Update Confirmation Dialog */}
      <ConfirmationPopup
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        title="Update Leaderboards?"
        description="This will recalculate all leaderboard rankings based on current data. This process may take a few moments and will clear existing entries. Do you want to continue?"
        confirmText="Update"
        cancelText="Cancel"
        variant="primary"
        onConfirm={confirmUpdate}
        isPending={updateLeaderboardsMutation.isPending}
        isSuccess={updateLeaderboardsMutation.isSuccess}
        autoClose={true}
      />
    </div>
  );
}
