import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResearchType, updateResearchType, deleteResearchType } from "../../api/journalsApi";
import { toast } from "sonner";

export const useCreateResearchType = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResearchType,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Research type created successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to create research type";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateResearchType = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResearchType,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Research type updated successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to update research type";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useDeleteResearchType = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResearchType,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Research type deleted successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete research type";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
