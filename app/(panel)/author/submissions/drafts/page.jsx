"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  AuthorSubmissionsTable,
  LoadingScreen,
  SubmissionsLayout,
} from "@/features";
import { useGetDraftSubmissions } from "@/features/panel/author/hooks/query/useGetDraftSubmissions";
import DocumentUploadModal from "@/features/panel/author/components/submission/DocumentUploadModal";
import DocumentViewModal from "@/features/panel/author/components/submission/DocumentViewModal";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";
import { useDeleteSubmission } from "@/features/panel/author/hooks/mutation/useDeleteSubmission";
import { ConfirmationPopup, Pagination } from "@/features/shared";

export default function DraftsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const params = {
    page: currentPage,
  };

  const {
    data: SubmissionsData,
    isPending: isSubmissionsPending,
    error,
  } = useGetDraftSubmissions({ params });

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  const submitForReviewMutation = useSubmitForReview();
  const deleteSubmissionMutation = useDeleteSubmission();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

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

  const handleEdit = (submission) => {
    router.push(`/author/submissions/${submission.id}/edit`);
  };

  const confirmDelete = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSubmissionToDelete(null);
          deleteSubmissionMutation.reset();
        },
      });
    }
  };

  return (
    <div>
      {isSubmissionsPending && <LoadingScreen />}
      <SubmissionsLayout
        title="Draft Submissions"
        description="Work in progress manuscripts that haven't been submitted yet"
      >
        <AuthorSubmissionsTable
          submissions={SubmissionsData?.results || []}
          isPending={isSubmissionsPending}
          error={error}
          onAddDocuments={handleAddDocuments}
          onViewDocuments={handleViewDocuments}
          onSubmit={handleSubmit}
          viewUrl={(submission) =>
            `/author/submissions/drafts/${submission.id}`
          }
          onEdit={handleEdit}
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

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            deleteSubmissionMutation.reset();
          }
        }}
        title="Delete Submission"
        description={`Are you sure you want to delete "${submissionToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        isPending={deleteSubmissionMutation.isPending}
        isSuccess={deleteSubmissionMutation.isSuccess}
        icon={<Trash2 className="h-6 w-6 text-destructive" />}
      />

      {/* Pagination */}
      {SubmissionsData && SubmissionsData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(SubmissionsData.count / 10)}
          totalCount={SubmissionsData.count}
          pageSize={10}
          onPageChange={handlePageChange}
          showPageSizeSelector={false}
        />
      )}
    </div>
  );
}
