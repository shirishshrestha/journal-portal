import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProductionAssignment,
  updateProductionAssignment,
  startProductionAssignment,
  completeProductionAssignment,
} from "../../api";

/**
 * Hook to create a production assignment
 */
export function useCreateProductionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createProductionAssignment(data),
    onSuccess: (data) => {
      toast.success("Production assistant assigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-assignments", data.submission],
      });
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to assign production assistant";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a production assignment
 */
export function useUpdateProductionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, data }) =>
      updateProductionAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success("Assignment updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-assignment", data.id],
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
 * Hook to start a production assignment
 */
export function useStartProductionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId) => startProductionAssignment(assignmentId),
    onSuccess: (data) => {
      toast.success("Production started");
      queryClient.invalidateQueries({
        queryKey: ["production-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-assignment", data.id],
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
 * Hook to complete a production assignment
 */
export function useCompleteProductionAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, data }) =>
      completeProductionAssignment(assignmentId, data),
    onSuccess: (data) => {
      toast.success("Production completed successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-assignment", data.id],
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
