import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFromOJS } from "../../api/ojsConnectionApi";
import { toast } from "sonner";

/**
 * Custom hook to initiate import from OJS
 * @returns {Object} Mutation object
 */
export function useImportFromOJS() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (journalId) => importFromOJS(journalId),
    onSuccess: (data, journalId) => {
      toast.success(
        data.message ||
          "Import started successfully. Please wait while we sync submissions from OJS."
      );

      // Invalidate queries after import starts
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions", journalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal", journalId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to start import from OJS";
      toast.error(errorMessage);
    },
  });

  return mutation;
}
