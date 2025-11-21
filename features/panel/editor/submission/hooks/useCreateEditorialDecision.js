import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditorialDecision } from "../api/reviewsApi";
import { toast } from "sonner";

/**
 * Hook to create an editorial decision
 */
export const useCreateEditorialDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEditorialDecision,
    onSuccess: (data) => {
      toast.success("Editorial decision created successfully");

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["submissionDecisions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to create editorial decision";
      toast.error(errorMessage);
    },
  });
};
