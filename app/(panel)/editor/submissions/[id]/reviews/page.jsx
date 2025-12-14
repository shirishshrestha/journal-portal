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
import {
  LoadingScreen,
  ErrorCard,
  DecisionBadge,
  StatusBadge,
  statusConfig,
  ReviewSummaryCard,
} from "@/features/shared";
import { reviewRecommendationConfig } from "@/features";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { useGetEditorSubmissionById } from "@/features/panel/editor/submission";

export default function SubmissionReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;

  // Fetch submission details
  const {
    data: submission,
    isLoading: isSubmissionLoading,
    error: submissionError,
  } = useGetEditorSubmissionById(submissionId);

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

  if (submissionError) {
    return (
      <ErrorCard
        title="Failed to load submission details"
        description={
          submissionError?.message || "Error loading submission details."
        }
        onRetry={() => router.back()}
      />
    );
  }

  if (reviewsError) {
    return (
      <ErrorCard
        title="Failed to load reviews"
        description={reviewsError?.message || "Error loading reviews."}
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
          <h1 className="text-3xl font-semibold text-foreground">
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
              <StatusBadge
                status={submission?.status}
                statusConfig={statusConfig}
              />
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
            <div key={review.id}>
              <ReviewSummaryCard
                reviews={[review]}
                showViewFullReview={true}
                onViewFullReview={(reviewId) =>
                  router.push(`/editor/reviews/${reviewId}`)
                }
                title={`Review ${index + 1}${
                  review.review_round > 1
                    ? ` (Round ${review.review_round})`
                    : ""
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
