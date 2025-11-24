"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetReviewAssignments } from "@/features/panel/reviewer/hooks/useGetReviewAssignments";
import { useAcceptReviewAssignment } from "@/features/panel/reviewer/hooks/mutation/useAcceptReviewAssignment";
import { useDeclineReviewAssignment } from "@/features/panel/reviewer/hooks/mutation/useDeclineReviewAssignment";
import { AssignmentCard } from "../_components/AssignmentCard";
import { DeclineDialog } from "../_components/DeclineDialog";
import { EmptyState } from "../_components/EmptyState";
import { toast } from "sonner";

export default function CompletedAssignmentsPage() {
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const { data: assignmentsData, isLoading, error } = useGetReviewAssignments();
  const acceptMutation = useAcceptReviewAssignment();
  const declineMutation = useDeclineReviewAssignment();

  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];
  const completedAssignments = assignments.filter(
    (a) => a.status === "COMPLETED"
  );

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

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 mt-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              Failed to load completed assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message || "An error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedAssignments.map((assignment) => (
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
    </>
  );
}
