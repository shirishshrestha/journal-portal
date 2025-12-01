import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubmission } from "../../api/submissionsApi";
import { toast } from "sonner";

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSubmission(id, data),
    onSuccess: (data) => {
      toast.success("Submission updated successfully");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission", data.id] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update submission";
      toast.error(errorMessage);
    },
  });
};
