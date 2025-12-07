"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Calendar,
  FileEdit,
} from "lucide-react";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { useGetSubmissionDecisions } from "@/features/panel/editor/submission/hooks/useGetSubmissionDecisions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationPopup,
  DecisionBadge,
  decisionTypeConfig,
  ErrorCard,
  StatusBadge,
  statusConfig,
  useAssignReviewers,
  useGetEditorSubmissionById,
  useGetReviewerRecommendations,
  useSyncSubmissionToOJS,
} from "@/features";
import { SubmissionInfoCard } from "@/features/panel/editor/submission/components/SubmissionInfoCard";
import { SubmissionDocuments } from "@/features/panel/editor/submission/components/SubmissionDocumentsCard";
import { SubmissionCoAuthorsCard } from "@/features/panel/editor/submission/components/SubmissionCoAuthorsCard";
import { ReviewerRecommendations } from "@/features/panel/editor/submission/components/ReviewerRecommendationsCard";
import { InvitedReviewersCard } from "@/features/panel/editor/submission/components/InvitedReviewersCard";
import { EditorialDecisionForm } from "@/features/panel/editor/submission/components/EditorialDecisionForm";

export default function EditorSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;
  const [assigningReviewerId, setAssigningReviewerId] = useState(null);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  // Fetch submission details
  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useGetEditorSubmissionById(submissionId);

  // Sync submission to OJS mutation
  const {
    mutate: syncToOJS,
    isPending: isSyncing,
    isSuccess: syncSuccess,
  } = useSyncSubmissionToOJS();

  // Fetch reviewer recommendations (admin always sees them)
  const {
    data: recommendations,
    isPending: isRecommendationsPending,
    error: recommendationsError,
  } = useGetReviewerRecommendations(submissionId, !!submission);

  // Fetch submitted reviews
  const { data: reviewsData, isPending: isReviewsPending } =
    useGetSubmissionReviews(submissionId);

  // Fetch editorial decisions
  const { data: decisionsData, isPending: isDecisionsPending } =
    useGetSubmissionDecisions(submissionId);

  const reviews = React.useMemo(() => {
    return Array.isArray(reviewsData)
      ? reviewsData
      : reviewsData?.results || [];
  }, [reviewsData]);

  const decisions = React.useMemo(() => {
    return Array.isArray(decisionsData)
      ? decisionsData
      : decisionsData?.results || [];
  }, [decisionsData]);

  const hasDecision = React.useMemo(() => decisions.length > 0, [decisions]);
  const latestDecision = React.useMemo(() => decisions[0], [decisions]);

  // Assign reviewer mutation
  const assignReviewerMutation = useAssignReviewers();

  const handleSyncToOJS = () => {
    syncToOJS(submissionId, {
      onSuccess: () => {
        setIsSyncDialogOpen(false);
      },
    });
  };

  const handleAssignReviewer = (reviewerId) => {
    setAssigningReviewerId(reviewerId);

    // Get review deadline days from journal settings, default to 30 days
    const reviewDeadlineDays =
      submission?.journal_details?.settings?.review_deadline_days || 30;

    // Calculate due date based on journal settings
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + reviewDeadlineDays);

    assignReviewerMutation.mutate(
      {
        submission: submissionId,
        reviewer: reviewerId,
        due_date: dueDate.toISOString().split("T")[0],
        invitation_message: `You have been invited to review the manuscript "${submission.title}". Please review and provide your feedback within ${reviewDeadlineDays} days.`,
      },
      {
        onSettled: () => {
          setAssigningReviewerId(null);
        },
      }
    );
  };

  if (isSubmissionLoading) {
    return (
      <div className=" space-y-6">
        <Skeleton className="h-10 w-48" />
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
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
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

  if (submissionError || !submission) {
    return (
      <ErrorCard
        title="Failed to Load Submission"
        description={
          submissionError?.message ||
          "Unable to load submission details. Please try again."
        }
        onRetry={refetchSubmission}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="secondary"
            size="sm"
            className={"mb-4"}
            onClick={() =>
              router.push(
                `/editor/journals/${submission?.journal.id}/submissions`
              )
            }
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Submission Details</h1>
          <p className="text-muted-foreground">Review and manage submission</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              router.push(`/editor/submissions/${submissionId}/copyediting`)
            }
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Copyediting Workflow
          </Button>
          {submission?.journal?.ojs_connection_status?.configured && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSyncDialogOpen(true)}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync to OJS
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Submission Details Card */}
      <SubmissionInfoCard submission={submission} />

      {/* Documents Section */}
      <SubmissionDocuments
        submission={submission}
        submissionId={submissionId}
      />

      {/* Co-authors Section */}
      <SubmissionCoAuthorsCard submission={submission} />

      {/* Reviewer Recommendations Section */}
      <ReviewerRecommendations
        recommendations={recommendations}
        isRecommendationsPending={isRecommendationsPending}
        recommendationsError={recommendationsError}
        assigningReviewerId={assigningReviewerId}
        assignReviewerMutation={assignReviewerMutation}
        onAssignReviewer={handleAssignReviewer}
      />

      {/* Invited Reviewers Section */}
      <InvitedReviewersCard submission={submission} />

      {/* Editorial Decision Section - Only for final publishing after reviewers accept */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Editorial Decision</CardTitle>
                <CardDescription className={"mt-1"}>
                  {hasDecision
                    ? "Final publishing decision has been made"
                    : "Make final decision for publication (submission has been accepted by reviewers)"}
                </CardDescription>
              </div>
              {isDecisionsPending && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasDecision && latestDecision && (
              <div className="space-y-4 mb-6">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Editorial Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        Made on{" "}
                        {format(
                          new Date(
                            latestDecision.decision_date ||
                              latestDecision.created_at
                          ),
                          "PPP"
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Decided by:{" "}
                        {latestDecision.decided_by_name || "Unknown"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <DecisionBadge
                        decisionType={latestDecision.decision_type}
                        config={decisionTypeConfig}
                        displayLabel={latestDecision.decision_type_display}
                      />
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {latestDecision.revision_deadline && (
                    <>
                      <div className="flex items-center gap-2 text-sm p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-300">
                          Revision Deadline:
                        </span>
                        <span className="text-blue-700 dark:text-blue-400">
                          {format(
                            new Date(latestDecision.revision_deadline),
                            "PPP"
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  {latestDecision.confidential_notes && (
                    <>
                      <Separator className="my-3" />
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <h5 className="text-sm font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                          Confidential Notes (Internal Only)
                        </h5>
                        <p className="text-sm text-yellow-900 dark:text-yellow-200 whitespace-pre-wrap">
                          {latestDecision.confidential_notes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <EditorialDecisionForm
              submissionId={submissionId}
              reviews={reviews}
              submission={submission}
            />
          </CardContent>
        </Card>
      )}

      {/* Status Information for Other Cases */}
      {reviews.length > 0 &&
        (submission.status === "REVISION_REQUIRED" ||
          submission.status === "REJECTED" ||
          submission.status === "UNDER_REVIEW") && (
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>
                Submission status based on reviewer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                {submission.status === "REVISION_REQUIRED" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status="REVISION_REQUIRED"
                        statusConfig={statusConfig}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reviewers have requested revisions. The author has been
                      notified and can upload a revised manuscript. Once the
                      author submits revisions, you can assign the same or new
                      reviewers for re-evaluation.
                    </p>
                  </div>
                )}

                {submission.status === "REJECTED" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status="REJECTED"
                        statusConfig={statusConfig}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This submission has been rejected based on reviewer
                      recommendations. The author has been notified.
                    </p>
                  </div>
                )}

                {submission.status === "UNDER_REVIEW" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status="UNDER_REVIEW"
                        statusConfig={statusConfig}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Waiting for all reviewers to complete their reviews.
                      Status will automatically update once all reviews are
                      submitted.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Sync to OJS Confirmation Dialog */}
      <ConfirmationPopup
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
        title="Sync Submission to OJS"
        description="This will sync the current submission data to Open Journal Systems (OJS). Any changes made here will be reflected in OJS."
        confirmText="Sync Now"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleSyncToOJS}
        isPending={isSyncing}
        isSuccess={syncSuccess}
        loadingText="Syncing to OJS..."
      />
    </div>
  );
}
