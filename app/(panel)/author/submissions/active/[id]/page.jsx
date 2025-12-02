"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import {
  RoleBasedRoute,
  LoadingScreen,
  DocumentUploadModal,
  useGetSubmissionById,
  statusConfig,
  StatusBadge,
  useSubmitForReview,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
  DocumentVersionsModal,
  ReviewSummaryCard,
} from "@/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { DecisionBadge, reviewRecommendationConfig } from "@/features";

export default function ActiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const {
    data: submission,
    isPending: isSubmissionPending,
    error,
  } = useGetSubmissionById(submissionId);

  const submitForReviewMutation = useSubmitForReview();
  const handleSubmitForReview = () => {
    submitForReviewMutation.mutate(submissionId, {
      onSuccess: () => {
        router.push("/author/submissions/active");
      },
    });
  };

  // Fetch reviews for this submission
  const {
    data: reviews,
    isPending: isReviewsPending,
    error: reviewsError,
  } = useGetSubmissionReviews(submissionId);

  const reviewsData = useMemo(() => reviews?.results || [], [reviews]);

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  const handleViewVersions = (documentId) => {
    setSelectedDocumentId(documentId);
    setVersionsDialogOpen(true);
  };

  if (isSubmissionPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/author/submissions/active")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Active Submissions
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/author/submissions/active")}
              className={"hover:text-primary-foreground"}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Active Submissions
            </Button>
          </div>
          {submission?.status === "REVISION_REQUIRED" && (
            <div>
              <Button
                onClick={handleSubmitForReview}
                disabled={
                  !submission?.documents ||
                  submission.documents.length === 0 ||
                  submitForReviewMutation.isPending
                }
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {submitForReviewMutation.isPending
                  ? "Submitting..."
                  : "Submit for Review"}
              </Button>
            </div>
          )}
        </div>

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} />

        {/* Review Summary Card (latest review only, no confidential comments) */}
        {reviewsData &&
          Array.isArray(reviewsData) &&
          reviewsData.length > 0 && (
            <ReviewSummaryCard
              reviews={reviewsData}
              showViewFullReview={false}
            />
          )}

        {/* Documents Card */}
        <SubmissionDocumentsCard
          submission={submission}
          onUpload={
            submission?.status === "REVISION_REQUIRED" ? handleUpload : null
          }
          onViewVersions={handleViewVersions}
          editBasePath={
            submission?.status === "REVISION_REQUIRED"
              ? "/author/submissions/active"
              : null
          }
          isEditable={true}
        />

        {/* Co-authors Card */}
        <CoAuthorsCard authorContributions={submission?.author_contributions} />
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        submissionId={submissionId}
      />

      {/* Document Versions Modal */}
      <DocumentVersionsModal
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        documentId={selectedDocumentId}
      />
    </>
  );
}
