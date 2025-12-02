import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configureOJSConnection } from "../../api/ojsConnectionApi";
import { toast } from "sonner";

export const useConfigureOJSConnection = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, data }) =>
      configureOJSConnection(journalId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ojs-status", variables.journalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal", variables.journalId],
      });
      toast.success("OJS connection configured successfully");
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to configure OJS connection";
      toast.error(errorMessage);
      options.onError?.(error, variables);
    },
  });
};
