"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthorSubmissionsTable,
  LoadingScreen,
  RoleBasedRoute,
  useGetSubmissions,
  SubmissionsLayout,
  useCategorizedSubmissions,
} from "@/features";
import DocumentUploadModal from "@/features/panel/author/components/submission/DocumentUploadModal";
import DocumentViewModal from "@/features/panel/author/components/submission/DocumentViewModal";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";
import { useDeleteSubmission } from "@/features/panel/author/hooks/mutation/useDeleteSubmission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ArchivedPage() {
  const router = useRouter();
  const {
    data: SubmissionsData,
    isPending: isSubmissionsPending,
    error,
  } = useGetSubmissions();

  const { categorized, counts } = useCategorizedSubmissions(
    SubmissionsData?.results || []
  );

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
        description="Completed submissions (accepted, rejected, withdrawn, or published)"
        counts={counts}
      >
        <AuthorSubmissionsTable
          submissions={categorized.archived}
          isPending={isSubmissionsPending}
          error={error}
          onAddDocuments={handleAddDocuments}
          onViewDocuments={handleViewDocuments}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your submission &quot;
              {submissionToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RoleBasedRoute>
  );
}
