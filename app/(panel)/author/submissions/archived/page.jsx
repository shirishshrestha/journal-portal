"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  AuthorSubmissionsTable,
  LoadingScreen,
  RoleBasedRoute,
  SubmissionsLayout,
} from "@/features";
import { useGetArchivedSubmissions } from "@/features/panel/author/hooks/query/useGetArchivedSubmissions";
import DocumentUploadModal from "@/features/panel/author/components/submission/DocumentUploadModal";
import DocumentViewModal from "@/features/panel/author/components/submission/DocumentViewModal";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";
import { useDeleteSubmission } from "@/features/panel/author/hooks/mutation/useDeleteSubmission";
import { ConfirmationPopup } from "@/features/shared";

export default function ArchivedPage() {
  const router = useRouter();
  const {
    data: SubmissionsData,
    isPending: isSubmissionsPending,
    error,
  } = useGetArchivedSubmissions();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  const submitForReviewMutation = useSubmitForReview();
  const deleteSubmissionMutation = useDeleteSubmission();

  const handleAddDocuments = (submission) => {
    setSelectedSubmissionId(submission.id);
    setUploadModalOpen(true);
  };

  const handleViewDocuments = (submission) => {
    setSelectedSubmissionId(submission.id);
    setViewModalOpen(true);
  };

  const handleSubmit = (submission) => {
    submitForReviewMutation.mutate(submission.id);
  };

  const handleDelete = (submission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSubmissionToDelete(null);
        },
      });
    }
  };

  return (
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      {isSubmissionsPending && <LoadingScreen />}
      <SubmissionsLayout
        title="Archived Submissions"
        description="Completed manuscripts (accepted, rejected, withdrawn, or published)"
      >
        <AuthorSubmissionsTable
          submissions={SubmissionsData?.results || []}
          isPending={isSubmissionsPending}
          error={error}
          onAddDocuments={handleAddDocuments}
          onViewDocuments={handleViewDocuments}
          onSubmit={handleSubmit}
          viewUrl={(submission) =>
            `/author/submissions/archived/${submission.id}`
          }
        />
      </SubmissionsLayout>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        submissionId={selectedSubmissionId}
      />

      {/* Document View Modal */}
      <DocumentViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        submissionId={selectedSubmissionId}
      />
    </RoleBasedRoute>
  );
}
