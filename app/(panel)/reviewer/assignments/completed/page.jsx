'use client';

import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetCompletedAssignments } from '@/features/panel/reviewer/hooks/query/useGetCompletedAssignments';
import { AssignmentCard } from '../../../../../features/panel/reviewer/components/assignments/AssignmentCard';
import { EmptyState } from '../../../../../features/panel/reviewer/components/assignments/EmptyState';
import { ErrorCard } from '@/features';
import { Pagination } from '@/features/shared';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CompletedAssignmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const params = {
    page: currentPage,
  };

  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useGetCompletedAssignments({ params });

  const completedAssignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (isPending) {
    return (
      <div className="space-y-4 mt-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className={'space-y-4'}>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>

                <Skeleton className="h-10 w-full mt-8" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <ErrorCard
          title="Failed to Load Completed Assignments"
          description={
            error?.message || 'Unable to load your completed review assignments. Please try again.'
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mt-6">
        {completedAssignments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No completed reviews"
            description="You haven't completed any reviews yet"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completedAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {assignmentsData && assignmentsData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(assignmentsData.count / 6)}
          totalCount={assignmentsData.count}
          pageSize={6}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}
    </>
  );
}
