import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournal } from "../../api/journalsApi";
import { toast } from "sonner";

export const useUpdateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...journalData }) => {
      return updateJournal({ id, journalData });
    },
    onSuccess: (data, variables, context) => {
      // Invalidate both the journal list and the specific journal
      queryClient.invalidateQueries({ queryKey: ["admin-journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal", variables.id] });

      // Don't show toast here if custom onSuccess is provided
      if (!options.onSuccess) {
        toast.success("Journal updated successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Don't show toast here if custom onError is provided
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to update journal";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
