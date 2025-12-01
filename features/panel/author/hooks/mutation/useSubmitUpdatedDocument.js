import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocumentVersion } from "@/features/panel/author/api/superdocApi";

/**
 * Custom hook for creating a document version with change summary.
 * @param {Object} options
 * @param {string} options.documentId - Document ID
 * @param {string} options.submissionId - Submission ID
 * @param {function} [options.onSuccess] - Success callback
 * @param {function} [options.onError] - Error callback
 */
export function useSubmitUpdatedDocument({ documentId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changeSummary) =>
      createDocumentVersion(documentId, changeSummary),
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["document-versions"] });

      if (onSuccess) onSuccess(data, ...args);
    },
    onError: (error, ...args) => {
      if (onError) onError(error, ...args);
    },
  });
}
