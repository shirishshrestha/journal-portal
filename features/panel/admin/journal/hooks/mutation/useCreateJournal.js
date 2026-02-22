import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJournal } from '../../api/journalsApi';
import { toast } from 'sonner';

export const useCreateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalData) => createJournal(journalData),
    onSuccess: async (data, variables, context) => {
      // Invalidate all admin-journals queries regardless of params
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'admin-journals',
      });

      // Force immediate refetch of all matching queries
      await queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'admin-journals',
      });

      toast.success('Journal created successfully!');

      // Call custom callback after refetch completes
      if (options.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.short_name ||
        'Failed to create journal';
      toast.error(errorMessage);
      options.onError?.(error, variables, context);
    },
  });
};
