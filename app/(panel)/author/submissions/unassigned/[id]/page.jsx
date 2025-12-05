"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetReviewerRecommendations } from "@/features/panel/author/hooks/query/useGetReviewerRecommendations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  LoadingScreen,
  useGetSubmissionById,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
  DocumentVersionsModal,
} from "@/features";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter as useNextRouter } from "next/navigation";
import { ReviewerRecommendations } from "@/features/panel/editor/submission/components/ReviewerRecommendationsCard";

export default function UnassignedDetailPage() {
  const params = useParams();
  const router = useNextRouter();
  const submissionId = params.id;

  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

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

  const handleViewVersions = (documentId) => {
    setSelectedDocumentId(documentId);
    setVersionsDialogOpen(true);
  };

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
    <>
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

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} />

        {/* Documents Card */}
        <SubmissionDocumentsCard
          submission={submission}
          onViewVersions={handleViewVersions}
          isEditable={true}
        />

        {/* Co-authors Card */}
        <CoAuthorsCard authorContributions={submission?.author_contributions} />

        {/* Recommended Reviewers Card */}
        <ReviewerRecommendations
          recommendations={recommendations}
          isLoading={isRecommendationsPending}
          error={recommendationsError}
          reviewType={reviewType}
        />
      </div>

      {/* Document Versions Modal */}
      <DocumentVersionsModal
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        documentId={selectedDocumentId}
      />
    </>
  );
}
