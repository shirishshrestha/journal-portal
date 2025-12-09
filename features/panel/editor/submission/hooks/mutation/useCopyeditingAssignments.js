import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCopyeditingAssignment,
  updateCopyeditingAssignment,
  startCopyeditingAssignment,
  completeCopyeditingAssignment,
} from "../../api";

/**
 * Hook to create a copyediting assignment
 */
export function useCreateCopyeditingAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCopyeditingAssignment(data),
    onSuccess: (data) => {
      toast.success("Copyeditor assigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments", data.submission],
      });
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to assign copyeditor";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a copyediting assignment
 */
export function useUpdateCopyeditingAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, data }) =>
      updateCopyeditingAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success("Assignment updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignment", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update assignment";
      toast.error(message);
    },
  });
}

/**
 * Hook to start a copyediting assignment
 */
export function useStartCopyeditingAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId) => startCopyeditingAssignment(assignmentId),
    onSuccess: (data) => {
      toast.success("Copyediting started");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignment", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-files"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to start assignment";
      toast.error(message);
    },
  });
}

/**
 * Hook to complete a copyediting assignment
 */
export function useCompleteCopyeditingAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, data }) =>
      completeCopyeditingAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success("Copyediting completed successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-assignment", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to complete assignment";
      toast.error(message);
    },
  });
}
