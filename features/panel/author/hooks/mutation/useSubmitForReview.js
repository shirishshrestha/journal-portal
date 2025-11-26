import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitForReview } from "../../api/submissionsApi";
import { toast } from "sonner";

export const useSubmitForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => submitForReview(id),
    onSuccess: (data) => {
      toast.success("Submission submitted for review successfully!");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission"] });
      queryClient.invalidateQueries({ queryKey: ["my-analytics"] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to submit for review";
      toast.error(errorMessage);
    },
  });
};
