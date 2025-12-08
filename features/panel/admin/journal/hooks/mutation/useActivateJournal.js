import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateJournal } from "../../api/inactiveJournalsApi";
import { toast } from "sonner";

export const useActivateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => activateJournal(id),
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
      toast.success("Journal activated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail || "Failed to activate journal"
      );
    },
  });
};
