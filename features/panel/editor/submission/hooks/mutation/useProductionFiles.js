import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  uploadProductionFile,
  updateProductionFile,
  approveProductionFile,
  publishGalleyFile,
  deleteProductionFile,
} from "../../api";

/**
 * Hook to upload a production file (galley)
 */
export function useUploadProductionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => uploadProductionFile(formData),
    onSuccess: (data) => {
      toast.success("Galley file uploaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-files", data.submission],
      });
      if (data.assignment) {
        queryClient.invalidateQueries({
          queryKey: ["production-assignment", data.assignment],
        });
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to upload galley file";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a production file
 */
export function useUpdateProductionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, data }) => updateProductionFile(fileId, data),
    onSuccess: (data) => {
      toast.success("File updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-file", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update file";
      toast.error(message);
    },
  });
}

/**
 * Hook to approve a production file
 */
export function useApproveProductionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId) => approveProductionFile(fileId),
    onSuccess: (data) => {
      toast.success("Galley file approved");
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-file", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to approve file";
      toast.error(message);
    },
  });
}

/**
 * Hook to publish a galley file
 */
export function usePublishGalleyFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId) => publishGalleyFile(fileId),
    onSuccess: (data) => {
      toast.success("Galley file published");
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-file", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to publish galley file";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a production file
 */
export function useDeleteProductionFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId) => deleteProductionFile(fileId),
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to delete file";
      toast.error(message);
    },
  });
}
