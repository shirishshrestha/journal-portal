"use client";

import { CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAcceptedAssignments } from "@/features/panel/reviewer/hooks/query/useGetAcceptedAssignments";
import { AssignmentCard } from "../../../../../features/panel/reviewer/components/assignments/AssignmentCard";
import { EmptyState } from "../../../../../features/panel/reviewer/components/assignments/EmptyState";
import { ErrorCard } from "@/features";
import { Pagination } from "@/features/shared";
import { useSearchParams, useRouter } from "next/navigation";

export default function AcceptedAssignmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const params = {
    page: currentPage,
  };

  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useGetAcceptedAssignments({ params });

  const acceptedAssignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
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
              <CardContent className={"space-y-4"}>
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
          title="Failed to Load Accepted Assignments"
          description={
            error?.message ||
            "Unable to load your accepted review assignments. Please try again."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mt-6">
        {acceptedAssignments.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No accepted reviews"
            description="You have no accepted review assignments"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {acceptedAssignments.map((assignment) => (
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
