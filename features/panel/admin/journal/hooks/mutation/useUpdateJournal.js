import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournal } from "../../api/inactiveJournalsApi";
import { toast } from "sonner";

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateJournal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-inactive-journals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-journal", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-journals"],
      });
      toast.success("Journal updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to update journal");
    },
  });
};
