import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFromOJS } from "../../api/ojsConnectionApi";
import { toast } from "sonner";

/**
 * Custom hook to import submissions from OJS
 * @returns {Object} Mutation object
 */
export function useImportFromOJS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importFromOJS,
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
}
