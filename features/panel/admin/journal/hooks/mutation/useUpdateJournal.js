import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournal } from "../../api/journalsApi";
import { toast } from "sonner";

export const useUpdateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...journalData }) => updateJournal({ id, journalData }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["admin-journals"] });
      toast.success("Journal updated successfully!");
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to update journal";
      toast.error(errorMessage);
      options.onError?.(error, variables, context);
    },
  });
};
