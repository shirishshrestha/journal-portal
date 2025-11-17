import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "../../api/submissionsApi";
import { toast } from "sonner";

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => uploadDocument(params.id, params.data),
    onSuccess: (data) => {
      toast.success("Documents uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission-documents"] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to upload documents";
      toast.error(errorMessage);
    },
  });
};
