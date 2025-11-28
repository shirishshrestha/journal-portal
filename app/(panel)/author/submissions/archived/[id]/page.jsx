"use client";

import { use, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  RoleBasedRoute,
  LoadingScreen,
  useGetSubmissionById,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
  DocumentVersionsModal,
} from "@/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubmissionReviews } from "@/features/panel/editor/submission/hooks/useGetSubmissionReviews";
import { DecisionBadge, reviewRecommendationConfig } from "@/features";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ArchivedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const {
    data: submission,
    isPending,
    error,
  } = useGetSubmissionById(submissionId);

  const handleViewVersions = (documentId) => {
    setSelectedDocumentId(documentId);
    setVersionsDialogOpen(true);
  };

  // Fetch reviews for this submission
  const {
    data: reviews,
    isPending: isReviewsPending,
    error: reviewsError,
  } = useGetSubmissionReviews(submissionId);

  const reviewsData = useMemo(() => reviews?.results || [], [reviews]);

  return (
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/author/submissions/archived")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Archived Submissions
            </Button>
          </div>
        </div>

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} />

        {/* Review Summary Card (latest review only, no confidential comments) */}
        {reviewsData &&
          Array.isArray(reviewsData) &&
          reviewsData.length > 0 && (
            <Card className={"gap-4  border-none"}>
              <CardHeader className={"gap-0 "}>
                <CardTitle className="text-lg">Reviews Summary</CardTitle>
              </CardHeader>
              <CardContent className={""}>
                <div className="">
                  <div
                    key={reviewsData[0].id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Review 1 (Latest)</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted on{" "}
                          {new Date(
                            reviewsData[0].submitted_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <DecisionBadge
                          decisionType={reviewsData[0].recommendation}
                          config={reviewRecommendationConfig}
                          className="mb-1"
                        />
                        <p className="text-xs text-muted-foreground">
                          Confidence: {reviewsData[0].confidence_level}/5
                        </p>
                      </div>
                    </div>
                    <div className="border-t my-2" />
                    {reviewsData[0].scores && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2">
                          Quality Assessment
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <p className="text-xs text-muted-foreground">
                              Novelty
                            </p>
                            <p className="text-lg font-semibold">
                              {reviewsData[0].scores.novelty}/10
                            </p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <p className="text-xs text-muted-foreground">
                              Methodology
                            </p>
                            <p className="text-lg font-semibold">
                              {reviewsData[0].scores.methodology}/10
                            </p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <p className="text-xs text-muted-foreground">
                              Clarity
                            </p>
                            <p className="text-lg font-semibold">
                              {reviewsData[0].scores.clarity}/10
                            </p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <p className="text-xs text-muted-foreground">
                              Significance
                            </p>
                            <p className="text-lg font-semibold">
                              {reviewsData[0].scores.significance}/10
                            </p>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <p className="text-xs text-muted-foreground">
                              Originality
                            </p>
                            <p className="text-lg font-semibold">
                              {reviewsData[0].scores.originality}/10
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="border-t my-2" />
                    <div>
                      <h5 className="text-sm font-semibold mb-2">
                        Detailed Review
                      </h5>
                      <div className="col-span-2">
                        <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border bg-muted/30 p-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: reviewsData[0].review_text,
                            }}
                            className="text-muted-foreground whitespace-pre-wrap"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Documents Card */}
        <SubmissionDocumentsCard
          submission={submission}
          onViewVersions={handleViewVersions}
          isEditable={false}
        />

        {/* Co-authors Card */}
        <CoAuthorsCard authorContributions={submission?.author_contributions} />
      </div>

      {/* Document Versions Modal */}
      <DocumentVersionsModal
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        documentId={selectedDocumentId}
      />
    </RoleBasedRoute>
  );
}
