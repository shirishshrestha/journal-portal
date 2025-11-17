import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubmission } from "../../api/submissionsApi";
import { toast } from "sonner";

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSubmission(id),
    onSuccess: (data) => {
      toast.success("Submission deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-analytics"] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to delete submission";
      toast.error(errorMessage);
    },
  });
};
