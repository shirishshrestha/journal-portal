import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  uploadCopyeditingFile,
  updateCopyeditingFile,
  approveCopyeditingFile,
  deleteCopyeditingFile,
} from "../../api";

/**
 * Hook to upload a copyediting file
 */
export function useUploadCopyeditingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => uploadCopyeditingFile(formData),
    onSuccess: (data) => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files", data.submission],
      });
      if (data.assignment) {
        queryClient.invalidateQueries({
          queryKey: ["copyediting-assignment", data.assignment],
        });
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to upload file";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a copyediting file
 */
export function useUpdateCopyeditingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, data }) => updateCopyeditingFile(fileId, data),
    onSuccess: (data) => {
      toast.success("File updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-file", data.id],
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
 * Hook to approve a copyediting file
 */
export function useApproveCopyeditingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId) => approveCopyeditingFile(fileId),
    onSuccess: (data) => {
      toast.success("File approved successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files"],
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
 * Hook to delete a copyediting file
 */
export function useDeleteCopyeditingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId) => deleteCopyeditingFile(fileId),
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files"],
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

/**
 * Hook to confirm file as final (author action)
 */
export function useConfirmFileFinal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, data }) => {
      const { confirmFileFinal } = require("../../api");
      return confirmFileFinal(fileId, data);
    },
    onSuccess: (data) => {
      toast.success("File confirmed as final successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files", data.file.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to confirm file";
      toast.error(message);
    },
  });
}
