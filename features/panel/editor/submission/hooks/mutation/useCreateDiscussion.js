import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiscussion } from "../../api";
import { toast } from "sonner";

/**
 * Hook to create a new copyediting discussion
 * @returns {Object} React Query mutation result
 */
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createDiscussion(data),
    onSuccess: (data, variables) => {
      toast.success("Discussion created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions", variables.submissionId],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create discussion.";
      toast.error(message);
    },
  });
};
