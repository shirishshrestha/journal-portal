"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Mail, AlertCircle, Clock } from "lucide-react";
import { StatusBadge, statusConfig, ErrorCard } from "@/features";
import { useGetReviewAssignmentById } from "@/features/panel/reviewer/hooks/query/useGetReviewAssignmentById";
import {
  SubmissionDetailsTab,
  DocumentsTab,
  ReviewTab,
} from "@/features/panel/reviewer/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id;

  // Fetch assignment details
  const {
    data: assignment,
    isPending: isLoading,
    error,
    refetch,
  } = useGetReviewAssignmentById(assignmentId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <ErrorCard
        title="Failed to Load Review Assignment"
        description={
          error?.message ||
          "Unable to load review assignment details. Please try again."
        }
        onRetry={refetch}
        onBack={() => router.back()}
      />
    );
  }

  const submission = assignment?.submission_details;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Review Assignment</h1>
          <p className="text-muted-foreground">
            Review manuscript and provide feedback
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/reviewer/assignments`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Assignment Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">
                {assignment.submission_title || "Untitled Submission"}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Invited {format(new Date(assignment.invited_at), "PPP")}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Due {format(new Date(assignment.due_date), "PPP")}
                </div>
              </div>
            </div>
            <StatusBadge
              status={assignment?.submission_details.status}
              statusConfig={statusConfig}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timeline */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Invited At</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(assignment.invited_at), "PPP p")}
              </p>
            </div>
            {assignment.accepted_at && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Accepted At</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(assignment.accepted_at), "PPP p")}
                </p>
              </div>
            )}
            {assignment.declined_at && (
              <div className="p-3 bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg">
                <p className="text-sm font-medium mb-1">Declined At</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(assignment.declined_at), "PPP p")}
                </p>
              </div>
            )}
            {assignment.completed_at && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm font-medium mb-1">Completed At</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(assignment.completed_at), "PPP p")}
                </p>
              </div>
            )}
          </div>

          {/* Days Remaining / Overdue */}
          {assignment.days_remaining != null &&
            assignment.status === "ACCEPTED" && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  assignment.is_overdue
                    ? "bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 text-destructive dark:text-destructive"
                    : assignment.days_remaining <= 3
                    ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                    : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                }`}
              >
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  {assignment.is_overdue
                    ? `${Math.abs(assignment.days_remaining)} days overdue`
                    : `${assignment.days_remaining} days remaining`}
                </span>
              </div>
            )}

          {/* Invitation Message */}
          {assignment.invitation_message && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Invitation Message</h3>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {assignment.invitation_message}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Decline Reason */}
          {assignment.status === "DECLINED" && assignment.decline_reason && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 text-destructive">
                  Decline Reason
                </h3>
                <div className="p-3 bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {assignment.decline_reason}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Assigned By */}
          {assignment.assigned_by_info && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Assigned By</h3>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">
                      {assignment.assigned_by_info.display_name ||
                        assignment.assigned_by_info.full_name}
                    </p>
                    {assignment.assigned_by_info.user_email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {assignment.assigned_by_info.user_email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submission Details */}
      {submission && (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Submission Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            {assignment?.submission_details.status === "UNDER_REVIEW" ||
            assignment?.submission_details.status === "REVISED" ? (
              <TabsTrigger value="review">Submit Review</TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <SubmissionDetailsTab
              submission={submission}
              isPending={isLoading}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <DocumentsTab submission={submission} assignmentId={assignmentId} />
          </TabsContent>

          <TabsContent value="review" className="space-y-4 mt-4">
            <ReviewTab assignment={assignment} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
