"use client";

import { useParams } from "next/navigation";
import { useGetSubmissionById } from "@/features/panel/author/hooks";
import EditSubmissionForm from "@/features/panel/author/components/edit-submission/EditSubmissionForm";
import { LoadingScreen, ErrorCard } from "@/features/shared/components";

export default function EditSubmissionPage() {
  const params = useParams();
  const submissionId = params.id;

  const {
    data: submission,
    isPending,
    isError,
    error,
    refetch,
  } = useGetSubmissionById(submissionId);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorCard
        title="Error loading submission"
        description="Unable to fetch submission details. Please try again."
        details={
          error?.message || (typeof error === "string" ? error : undefined)
        }
        onRetry={refetch}
      />
    );
  }

  if (!submission) {
    return (
      <ErrorCard
        title="Submission not found"
        description="The submission you're looking for doesn't exist."
      />
    );
  }

  return <EditSubmissionForm submission={submission} />;
}
