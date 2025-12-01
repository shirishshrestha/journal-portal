import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJournal } from "../../api/journalsApi";
import { toast } from "sonner";

export const useCreateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalData) => createJournal(journalData),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["editor-journals"] });
      toast.success("Journal created successfully!");
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.short_name ||
        "Failed to create journal";
      toast.error(errorMessage);
      options.onError?.(error, variables, context);
    },
  });
};
