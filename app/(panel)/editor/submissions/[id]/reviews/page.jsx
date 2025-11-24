"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
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
import { LoadingScreen, ErrorCard, DecisionBadge } from "@/features/shared";
import { reviewRecommendationConfig } from "@/features";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { useGetAdminSubmissionById } from "@/features/panel/editor/submission";

export default function SubmissionReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;

  // Fetch submission details
  const {
    data: submission,
    isLoading: isSubmissionLoading,
    error: submissionError,
  } = useGetAdminSubmissionById(submissionId);

  // Fetch reviews
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useGetSubmissionReviews(submissionId);

  const reviews = Array.isArray(reviewsData?.results)
    ? reviewsData.results
    : Array.isArray(reviewsData)
    ? reviewsData
    : [];

  if (isSubmissionLoading || isReviewsLoading) {
    return <LoadingScreen message="Loading reviews..." />;
  }

  if (submissionError || reviewsError) {
    return (
      <ErrorCard
        title="Failed to load reviews"
        description={
          submissionError?.message ||
          reviewsError?.message ||
          "Error loading data"
        }
        onRetry={() => router.back()}
      />
    );
  }

  // Helper function to get recommendation badge variant
  const getRecommendationVariant = (recommendation) => {
    switch (recommendation) {
      case "ACCEPT":
        return "default";
      case "REJECT":
        return "destructive";
      case "MINOR_REVISION":
        return "secondary";
      case "MAJOR_REVISION":
        return "outline";
      default:
        return "outline";
    }
  };

  // Helper function to get recommendation icon
  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case "ACCEPT":
        return <CheckCircle2 className="h-4 w-4" />;
      case "REJECT":
        return <XCircle className="h-4 w-4" />;
      case "MINOR_REVISION":
      case "MAJOR_REVISION":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Reviews for Submission
          </h1>
          <p className="text-muted-foreground">
            {submission?.title || "Loading..."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/editor/submissions/${submissionId}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Submission
        </Button>
      </div>

      {/* Submission Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Submission Number</p>
              <p className="font-medium">
                {submission?.submission_number || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{submission?.status_display || submission?.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="font-medium text-2xl">{reviews.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">
                No reviews have been submitted for this submission.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Submitted Reviews ({reviews.length})
          </h2>
          {reviews.map((review, index) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      Review {index + 1}
                      {review.review_round > 1 && (
                        <Badge variant="outline" className="ml-2">
                          Round {review.review_round}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Submitted on{" "}
                      {format(new Date(review.submitted_at), "PPP 'at' p")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(review.recommendation)}
                    <DecisionBadge
                      decisionType={review.recommendation}
                      config={reviewRecommendationConfig}
                      displayLabel={review.recommendation_display}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Review Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Reviewer Info */}
                  {!review.is_anonymous && review.reviewer_info && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Reviewer
                      </p>
                      <p className="font-medium">
                        {review.reviewer_info.full_name ||
                          review.reviewer_info.display_name ||
                          "Anonymous"}
                      </p>
                    </div>
                  )}

                  {review.is_anonymous && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Reviewer
                      </p>
                      <p className="font-medium text-muted-foreground">
                        Anonymous Review
                      </p>
                    </div>
                  )}

                  {/* Confidence Level */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Confidence Level
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full mr-1 ${
                              i < review.confidence_level
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {review.confidence_level}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Time */}
                  {review.review_time_days !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Review Time
                      </p>
                      <p className="font-medium">
                        {review.review_time_days} days
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Review Scores Preview */}
                {review.scores && Object.keys(review.scores).length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Quality Scores</p>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {Object.entries(review.scores)
                        .slice(0, 5)
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="text-center p-2 bg-muted/50 rounded"
                          >
                            <p className="text-xs text-muted-foreground capitalize truncate">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm font-semibold">
                              {typeof value === "number"
                                ? value.toFixed(1)
                                : value}
                              /10
                            </p>
                          </div>
                        ))}
                    </div>
                    {review.overall_score !== undefined && (
                      <div className="mt-2 text-center p-2 bg-primary/10 rounded">
                        <p className="text-xs text-muted-foreground">
                          Overall Score
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {review.overall_score.toFixed(1)}/10
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Review Text Preview */}
                <div>
                  <p className="text-sm font-semibold mb-2">Review Summary</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {review.review_text || "No review text provided."}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/editor/reviews/${review.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
