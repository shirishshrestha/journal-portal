'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  useGetSubmissionById,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
  DocumentVersionsModal,
  ReviewSummaryCard,
  LoadingScreen,
} from '@/features';
import { useGetSubmissionReviews } from '@/features/panel/editor/submission/hooks/useGetSubmissionReviews';

export default function ArchivedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const { data: submission, isPending, error } = useGetSubmissionById(submissionId);

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
    <>
      {' '}
      {(isPending||isReviewsPending) && <LoadingScreen/>}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/author/submissions/archived')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Archived Submissions
            </Button>
          </div>
        </div>

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} isSubmissionPending={isPending} />

        {/* Review Summary Card (latest review only, no confidential comments) */}
        {reviewsData && Array.isArray(reviewsData) && reviewsData.length > 0 && (
          <ReviewSummaryCard reviews={reviewsData} showViewFullReview={false} />
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
    </>
  );
}
