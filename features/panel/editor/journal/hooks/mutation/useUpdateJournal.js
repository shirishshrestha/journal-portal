import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournal } from "../../api/journalsApi";
import { toast } from "sonner";

export const useUpdateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...journalData }) => {
      console.log("Update Journal Mutation - ID:", id);
      console.log("Update Journal Mutation - Data:", journalData);
      return updateJournal({ id, journalData });
    },
    onSuccess: (data, variables, context) => {
      console.log("Journal update success:", data);
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
      console.error("Journal update error:", error);
      console.error("Error response:", error.response?.data);
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
