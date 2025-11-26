"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Send } from "lucide-react";
import {
  RoleBasedRoute,
  LoadingScreen,
  useDeleteSubmission,
  DocumentUploadModal,
  useGetSubmissionById,
  DocumentVersionsModal,
  ConfirmationPopup,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
} from "@/features";
import { Card, CardContent } from "@/components/ui/card";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";

export default function DraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;
  const {
    data: submission,
    isPending,
    error,
  } = useGetSubmissionById(submissionId);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const deleteSubmissionMutation = useDeleteSubmission();
  const submitForReviewMutation = useSubmitForReview();

  const handleSubmitForReview = () => {
    submitForReviewMutation.mutate(submissionId, {
      onSuccess: () => {
        router.push("/author/submissions/unassigned");
      },
    });
  };

  const handleDelete = () => {
    deleteSubmissionMutation.mutate(submissionId, {
      onSuccess: () => {
        router.push("/author/submissions/drafts");
      },
    });
  };

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

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
            onClick={() => router.push("/author/submissions/drafts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drafts
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
              onClick={() => router.push("/author/submissions/drafts")}
              className={"hover:text-primary-foreground"}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Drafts
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
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
        </div>

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} />

        {/* Documents Card */}
        <SubmissionDocumentsCard
          submission={submission}
          onUpload={handleUpload}
          onViewVersions={handleViewVersions}
          editBasePath="/author/submissions/drafts"
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

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Submission"
        description={`Are you sure you want to delete "${submission?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        isPending={deleteSubmissionMutation.isPending}
        isSuccess={deleteSubmissionMutation.isSuccess}
        icon={<Trash2 className="h-6 w-6 text-destructive" />}
      />
    </RoleBasedRoute>
  );
}
