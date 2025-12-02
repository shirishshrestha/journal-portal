import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectOJS } from "../../api/ojsConnectionApi";
import { toast } from "sonner";

export const useDisconnectOJS = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalId) => disconnectOJS(journalId),
    onSuccess: (data, journalId) => {
      queryClient.invalidateQueries({ queryKey: ["ojs-status", journalId] });
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      toast.success("OJS disconnected successfully");
      options.onSuccess?.(data, journalId);
    },
    onError: (error, journalId) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to disconnect OJS";
      toast.error(errorMessage);
      options.onError?.(error, journalId);
    },
  });
};
