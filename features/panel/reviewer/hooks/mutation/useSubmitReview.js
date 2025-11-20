import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../../api/reviewsApi";
import { toast } from "sonner";

/**
 * Hook to submit a review
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: (data) => {
      toast.success("Review submitted successfully");
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["reviewAssignments"] });
      queryClient.invalidateQueries({ queryKey: ["reviewAssignment"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to submit review";
      toast.error(errorMessage);
    },
  });
};
