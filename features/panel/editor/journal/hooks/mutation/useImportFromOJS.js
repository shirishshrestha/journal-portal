import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFromOJS } from "../../api/ojsConnectionApi";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Custom hook to import submissions from OJS
 * @returns {Object} Mutation object
 */
export function useImportFromOJS() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (journalId) => importFromOJS(journalId, setProgress),
    onSuccess: (data, journalId) => {
      // Invalidate submissions queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions", journalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal", journalId],
      });

      toast.success(
        data.message || "Submissions imported from OJS successfully"
      );
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to import submissions from OJS";
      toast.error(errorMessage);
    },
  });

  return {
    ...mutation,
    progress,
  };
}
