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
import {
  useGetAdminSubmissionById,
  useGetReviewerRecommendations,
  useUpdateSubmissionStatus,
  useAssignReviewer,
} from "@/features/panel/admin/submission";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;

  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch submission details
  const {
    data: submission,
    isLoading: isSubmissionLoading,
    error: submissionError,
  } = useGetAdminSubmissionById(submissionId);

  // Get review type from journal settings
  const reviewType = submission?.journal_details?.settings?.review_type;

  // Fetch reviewer recommendations (admin always sees them)
  const {
    data: recommendations,
    isLoading: isRecommendationsPending,
    error: recommendationsError,
  } = useGetReviewerRecommendations(submissionId, !!submission);

  // Update status mutation
  const updateStatusMutation = useUpdateSubmissionStatus();

  // Assign reviewer mutation
  const assignReviewerMutation = useAssignReviewer();

  // Set initial status when submission loads
  React.useEffect(() => {
    if (submission?.status) {
      setSelectedStatus(submission.status);
    }
  }, [submission?.status]);

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    updateStatusMutation.mutate(
      { id: submissionId, status: newStatus },
      {
        onSuccess: () => {
          alert("Status updated successfully");
        },
        onError: (error) => {
          console.error("Failed to update status:", error);
          alert("Failed to update status");
          setSelectedStatus(submission.status); // Reset on error
        },
      }
    );
  };

  const handleAssignReviewer = (reviewerId) => {
    // Get review deadline days from journal settings, default to 30 days
    const reviewDeadlineDays = submission?.journal_details?.settings?.review_deadline_days || 30;
    
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
        onSuccess: () => {
          alert("Reviewer assigned successfully");
        },
        onError: (error) => {
          console.error("Failed to assign reviewer:", error);
          const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.non_field_errors?.[0] ||
                               "Failed to assign reviewer";
          alert(errorMessage);
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
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">
                Failed to load submission details
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "REVISION_REQUESTED", label: "Revision Requested" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PUBLISHED", label: "Published" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

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
              <Badge variant="secondary">{submission.status_display}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Submission Number</h3>
            <p className="text-muted-foreground">
              {submission.submission_number}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Journal</h3>
            <p className="text-muted-foreground">{submission.journal_name}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Status Management</h3>
            <div className="flex items-center gap-3">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {updateStatusMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Abstract</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {submission.abstract}
            </p>
          </div>

          {submission.metadata_json?.keywords && (
            <>
              <Separator />
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
            <div className="space-y-3">
              {submission.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
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
                        onClick={() => window.open(doc.file_url, "_blank")}
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
                The system couldn't find suitable reviewer recommendations for
                this submission
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
                          onClick={() => handleAssignReviewer(reviewer.reviewer_id)}
                          disabled={assignReviewerMutation.isPending}
                        >
                          {assignReviewerMutation.isPending ? (
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
    </div>
  );
}
