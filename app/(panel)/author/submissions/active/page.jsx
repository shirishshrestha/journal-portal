'use client';

import { useState } from 'react';
import { AuthorSubmissionsTable, LoadingScreen, Pagination, SubmissionsLayout } from '@/features';
import { useGetActiveSubmissions } from '@/features/panel/author/hooks/query/useGetActiveSubmissions';
import DocumentUploadModal from '@/features/panel/author/components/submission/DocumentUploadModal';
import DocumentViewModal from '@/features/panel/author/components/submission/DocumentViewModal';
import { useSubmitForReview } from '@/features/panel/author/hooks/mutation/useSubmitForReview';
import { useSearchParams } from 'next/navigation';

export default function ActivePage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const params = {
    page: currentPage,
  };
  const {
    data: SubmissionsData,
    isPending: isSubmissionsPending,
    error,
  } = useGetActiveSubmissions({ params });

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  const submitForReviewMutation = useSubmitForReview();

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

  return (
    <>
      <SubmissionsLayout
        title="Active Submissions"
        description="Manuscripts currently under review"
      >
        {isSubmissionsPending && <LoadingScreen />}
        <AuthorSubmissionsTable
          submissions={SubmissionsData?.results || []}
          isPending={isSubmissionsPending}
          error={error}
          onAddDocuments={handleAddDocuments}
          onViewDocuments={handleViewDocuments}
          onSubmit={handleSubmit}
          viewUrl={(submission) => `/author/submissions/active/${submission.id}`}
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
    </>
  );
}
