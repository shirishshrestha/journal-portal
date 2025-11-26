"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Mail,
  Building2,
  Star,
  Loader2,
  Eye,
  Download,
} from "lucide-react";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { useGetSubmissionDecisions } from "@/features/panel/editor/submission/hooks/useGetSubmissionDecisions";
import EditorialDecisionForm from "@/features/panel/editor/submission/components/EditorialDecisionForm";
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
import {
  useAssignReviewers,
  useGetEditorSubmissionById,
  useGetReviewerRecommendations,
} from "@/features/panel/editor/submission";
import {
  LoadingScreen,
  ErrorCard,
  StatusBadge,
  statusConfig,
  DecisionBadge,
  decisionTypeConfig,
  reviewRecommendationConfig,
} from "@/features";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function AdminSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;
  const [assigningReviewerId, setAssigningReviewerId] = useState(null);

  // Fetch submission details
  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useGetEditorSubmissionById(submissionId);

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

  const handleAssignReviewer = (reviewerId) => {
    console.log("Assigning reviewer ID:", reviewerId);
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
      <div className="p-6 space-y-6">
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
          <h1 className="text-3xl font-bold">Submission Details</h1>
          <p className="text-muted-foreground">Review and manage submission</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Submission Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{submission.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Submitted {format(new Date(submission.submitted_at), "PPP")}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {submission.corresponding_author_name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge
                status={submission.status}
                statusConfig={statusConfig}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Submission Number</h3>
            <p className="text-muted-foreground">
              {submission.submission_number}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Journal</h3>
            <p className="text-muted-foreground">{submission.journal.title}</p>
          </div>

          {/* Abstract */}
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Abstract</h3>
            <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border bg-muted/30 p-4">
              <div
                dangerouslySetInnerHTML={{ __html: submission?.abstract }}
                className="text-muted-foreground whitespace-pre-wrap"
              />
            </ScrollArea>
          </div>

          {submission.metadata_json?.keywords && (
            <>
              <div>
                <h3 className="font-semibold mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {submission.metadata_json.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Submitted manuscript files and supporting documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!submission.documents || submission.documents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No documents found</h3>
              <p className="text-sm text-muted-foreground">
                This submission has no documents attached
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {submission.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary stroke-[1.5]" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{doc.document_type_display}</span>
                        <span>•</span>
                        <span>{doc.file_name}</span>
                        {doc.file_size && (
                          <>
                            <span>•</span>
                            <span>
                              {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.file_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/editor/submissions/${submissionId}/documents/${doc.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                    {doc.original_file && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.original_file, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Co-authors Section */}
      {submission.author_contributions &&
        submission.author_contributions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Co-authors</CardTitle>
              <CardDescription>
                Authors contributing to this manuscript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission.author_contributions.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {author.profile?.display_name || "Unknown Author"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {author.contrib_role_display} • Order: {author.order}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Reviewer Recommendations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reviewer Recommendations</CardTitle>
              <CardDescription>
                AI-powered reviewer recommendations based on expertise
              </CardDescription>
            </div>
            {isRecommendationsPending && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recommendationsError ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Failed to load reviewer recommendations
              </p>
            </div>
          ) : isRecommendationsPending ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Analyzing submission and finding suitable reviewers...
              </p>
            </div>
          ) : !recommendations?.recommendations ||
            recommendations.recommendations.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">
                No recommendations available
              </h3>
              <p className="text-sm text-muted-foreground">
                The system couldn&apos;t find suitable reviewer recommendations
                for this submission
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendations.recommendations
                .slice(0, 5)
                .map((reviewer, index) => {
                  const compositeScore = reviewer.scores?.composite;
                  const similarityScore = reviewer.scores?.similarity;
                  const scorePercent = compositeScore
                    ? (compositeScore * 100).toFixed(1)
                    : null;

                  return (
                    <div
                      key={reviewer.reviewer_id || index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">
                              {reviewer.reviewer_name || "Unknown Reviewer"}
                            </h4>
                            {scorePercent && (
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                {scorePercent}% Match
                              </Badge>
                            )}
                          </div>

                          {reviewer.reviewer_email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {reviewer.reviewer_email}
                            </div>
                          )}

                          {reviewer.affiliation && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              {reviewer.affiliation}
                            </div>
                          )}

                          {reviewer.scores && (
                            <div className="flex flex-wrap gap-3 mt-2 text-xs">
                              {similarityScore != null && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <span className="font-medium">
                                    Expertise:
                                  </span>
                                  <span>
                                    {(similarityScore * 100).toFixed(0)}%
                                  </span>
                                </div>
                              )}
                              {reviewer.scores.availability != null && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <span className="font-medium">
                                    Availability:
                                  </span>
                                  <span>
                                    {(
                                      reviewer.scores.availability * 100
                                    ).toFixed(0)}
                                    %
                                  </span>
                                </div>
                              )}
                              {reviewer.scores.quality != null && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <span className="font-medium">Quality:</span>
                                  <span>
                                    {(reviewer.scores.quality * 100).toFixed(0)}
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {reviewer.expertise_areas &&
                            reviewer.expertise_areas.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {reviewer.expertise_areas.map((area, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAssignReviewer(reviewer.reviewer_id)
                          }
                          disabled={
                            assigningReviewerId === reviewer.reviewer_id &&
                            assignReviewerMutation.isPending
                          }
                        >
                          {assigningReviewerId === reviewer.reviewer_id &&
                          assignReviewerMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Assigning...
                            </>
                          ) : (
                            "Assign"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invited Reviewers Section */}
      {submission.review_assignments &&
        submission.review_assignments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invited Reviewers</CardTitle>
              <CardDescription>
                Reviewers who have been invited to review this submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {submission.review_assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {assignment.reviewer_name}
                          </h4>
                          <Badge
                            variant={
                              assignment.status === "ACCEPTED"
                                ? "default"
                                : assignment.status === "DECLINED"
                                ? "destructive"
                                : assignment.status === "COMPLETED"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {assignment.status_display}
                          </Badge>
                          {assignment.is_overdue &&
                            assignment.status === "ACCEPTED" && (
                              <Badge variant="destructive">Overdue</Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {assignment.reviewer_email}
                        </div>

                        {assignment.reviewer_affiliation && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {assignment.reviewer_affiliation}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Invited:{" "}
                              {format(new Date(assignment.invited_at), "PPP")}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Due:{" "}
                              {format(new Date(assignment.due_date), "PPP")}
                            </span>
                          </div>
                          {assignment.status === "ACCEPTED" &&
                            assignment.days_remaining != null && (
                              <>
                                <span>•</span>
                                <span
                                  className={
                                    assignment.days_remaining < 0
                                      ? "text-destructive font-medium"
                                      : ""
                                  }
                                >
                                  {assignment.days_remaining < 0
                                    ? `${Math.abs(
                                        assignment.days_remaining
                                      )} days overdue`
                                    : `${assignment.days_remaining} days remaining`}
                                </span>
                              </>
                            )}
                        </div>

                        {assignment.status === "ACCEPTED" &&
                          assignment.accepted_at && (
                            <p className="text-xs text-muted-foreground">
                              Accepted on{" "}
                              {format(new Date(assignment.accepted_at), "PPP")}
                            </p>
                          )}

                        {assignment.status === "DECLINED" &&
                          assignment.declined_at && (
                            <div className="text-xs">
                              <p className="text-muted-foreground">
                                Declined on{" "}
                                {format(
                                  new Date(assignment.declined_at),
                                  "PPP"
                                )}
                              </p>
                              {assignment.decline_reason && (
                                <p className="mt-1 text-destructive">
                                  Reason: {assignment.decline_reason}
                                </p>
                              )}
                            </div>
                          )}

                        {assignment.status === "COMPLETED" &&
                          assignment.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              Completed on{" "}
                              {format(new Date(assignment.completed_at), "PPP")}
                            </p>
                          )}

                        <p className="text-xs text-muted-foreground">
                          Assigned by: {assignment.assigned_by_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
    </div>
  );
}
