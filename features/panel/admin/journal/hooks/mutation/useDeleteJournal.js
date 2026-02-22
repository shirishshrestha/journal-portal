import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJournal } from '../../api/journalsApi';
import { toast } from 'sonner';

export const useDeleteJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalId) => deleteJournal(journalId),
    onSuccess: async (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-journals'],
        refetchType: 'active',
      });
      toast.success('Journal deleted successfully!');

      // Call custom callback after refetch completes
      if (options.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Failed to delete journal';
      toast.error(errorMessage);
      options.onError?.(error, variables, context);
    },
  });
};
