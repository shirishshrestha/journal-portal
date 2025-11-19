import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory, deleteCategory } from "../../api/journalsApi";
import { toast } from "sonner";

export const useCreateCategory = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Category created successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to create category";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateCategory = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Category updated successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to update category";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useDeleteCategory = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Category deleted successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete category";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
