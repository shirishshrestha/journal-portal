"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AssignmentCard,
  DeclineDialog,
  EmptyState,
  useAcceptReviewAssignment,
  useDeclineReviewAssignment,
  useGetPendingAssignments,
  ErrorCard,
} from "@/features";
import { Pagination } from "@/features/shared";
import { useSearchParams, useRouter } from "next/navigation";

export default function PendingAssignmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const params = {
    page: currentPage,
  };

  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Fetch pending assignments
  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useGetPendingAssignments({ params });

  // Mutations
  const acceptMutation = useAcceptReviewAssignment();
  const declineMutation = useDeclineReviewAssignment();

  // Extract assignments
  const pendingAssignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  // Handlers
  const handleAccept = (assignment) => {
    acceptMutation.mutate(assignment.id, {
      onSuccess: () => {
        toast.success("Review assignment accepted successfully!");
      },
      onError: (error) => {
        toast.error(
          `Failed to accept: ${error.response?.data?.error || error.message}`
        );
      },
    });
  };

  const handleDeclineClick = (assignment) => {
    setSelectedAssignment(assignment);
    setDeclineDialogOpen(true);
  };

  const handleDeclineSuccess = () => {
    setSelectedAssignment(null);
  };

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
          title="Failed to Load Pending Assignments"
          description={
            error?.message ||
            "Unable to load your pending review assignments. Please try again."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mt-6">
        {pendingAssignments.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No pending invitations"
            description="You have no pending review invitations at this time"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onAccept={handleAccept}
                onDeclineClick={handleDeclineClick}
                acceptMutation={acceptMutation}
                declineMutation={declineMutation}
              />
            ))}
          </div>
        )}
      </div>

      <DeclineDialog
        open={declineDialogOpen}
        onOpenChange={setDeclineDialogOpen}
        selectedAssignment={selectedAssignment}
        declineMutation={declineMutation}
        onSuccess={handleDeclineSuccess}
      />

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
