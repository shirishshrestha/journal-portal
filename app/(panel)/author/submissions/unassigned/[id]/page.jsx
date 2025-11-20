"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetReviewerRecommendations } from "@/features/panel/author/hooks/query/useGetReviewerRecommendations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Eye,
  Calendar,
  User,
  Star,
  Mail,
  Building2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  RoleBasedRoute,
  LoadingScreen,
  useGetSubmissionById,
} from "@/features";
import DocumentViewModal from "@/features/panel/author/components/submission/DocumentViewModal";

export default function UnassignedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const {
    data: submission,
    isPending,
    error,
  } = useGetSubmissionById(submissionId);

  // Get review type from journal settings, fallback to submission review_type
  const reviewType =
    submission?.journal?.settings?.review_type || submission?.review_type;

  const {
    data: recommendations,
    isPending: isRecommendationsPending,
    error: recommendationsError,
  } = useGetReviewerRecommendations(submissionId);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/author/submissions/unassigned")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Unassigned
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load submission</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/author/submissions/unassigned")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Unassigned
            </Button>
          </div>
        </div>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{submission?.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted{" "}
                    {format(new Date(submission?.submitted_at), "PPP")}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {submission?.corresponding_author_name}
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{submission?.status_display}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Submission Number</h3>
              <p className="text-muted-foreground">
                {submission?.submission_number}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Journal</h3>
              <p className="text-muted-foreground">
                {submission?.journal_name}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Abstract</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {submission?.abstract}
              </p>
            </div>

            {submission?.metadata_json?.keywords && (
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

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-muted-foreground">
                Awaiting reviewer assignment by journal editors
              </p>
            </div>
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
            {!submission?.documents || submission.documents.length === 0 ? (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewModalOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Co-authors Section */}
        {submission?.author_contributions &&
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

        {/* Recommended Reviewers Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recommended Reviewers</CardTitle>
                <CardDescription>
                  AI-powered reviewer recommendations based on expertise
                </CardDescription>
              </div>
              {reviewType === "OPEN" && isRecommendationsPending && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {reviewType === "SINGLE_BLIND" ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">
                  Single-Blind Review Process
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reviewer identities are kept confidential from authors during
                  the review process. Reviewer recommendations are not displayed
                  to maintain the integrity of the blind review.
                </p>
              </div>
            ) : reviewType === "DOUBLE_BLIND" ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">
                  Double-Blind Review Process
                </h3>
                <p className="text-sm text-muted-foreground">
                  Both reviewer and author identities are kept confidential
                  during the review process. Reviewer recommendations are not
                  displayed to maintain the integrity of the blind review.
                </p>
              </div>
            ) : recommendationsError ? (
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
                  The system couldn&apos;t find suitable reviewer
                  recommendations for this submission
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.recommendations
                  .slice(0, 5)
                  .map((reviewer, index) => {
                    // Access scores object
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

                            {/* Score Details */}
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
                                    <span className="font-medium">
                                      Quality:
                                    </span>
                                    <span>
                                      {(reviewer.scores.quality * 100).toFixed(
                                        0
                                      )}
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

                            {reviewer.recommendation_reason && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <span className="font-medium">
                                  Why recommended:
                                </span>{" "}
                                {reviewer.recommendation_reason}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">
                              Rank #{index + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document View Modal */}
      <DocumentViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        submissionId={submissionId}
      />
    </RoleBasedRoute>
  );
}
