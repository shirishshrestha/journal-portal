import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitUpdatedDocument } from "@/features/panel/author/api/superdocApi";
import { useRouter } from "next/navigation";

/**
 * Custom hook for submitting an updated document and notifying reviewers.
 * @param {Object} options
 * @param {string} options.documentId - Document ID
 * @param {string} options.submissionId - Submission ID
 * @param {function} [options.onSuccess] - Success callback
 * @param {function} [options.onError] - Error callback
 */
export function useSubmitUpdatedDocument({
  documentId,
  submissionId,
  onSuccess,
  onError,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => submitUpdatedDocument(documentId, submissionId),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({
        queryKey: ["superdoc-document", documentId],
      });
      if (onSuccess) onSuccess(data, ...args);
    },
    onError: (error, ...args) => {
      if (onError) onError(error, ...args);
    },
  });
}
