import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJournal } from '../../api/inactiveJournalsApi';
import { toast } from 'sonner';

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateJournal(id, data),
    onSuccess: async (data) => {
      // Invalidate all related queries first
      queryClient.invalidateQueries({ queryKey: ['admin-inactive-journals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-journal'] });
      queryClient.invalidateQueries({ queryKey: ['admin-journals'] });
      queryClient.invalidateQueries({ queryKey: ['editor-journals'] });

      // Then refetch active queries
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['admin-inactive-journals'],
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: ['admin-journal'],
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: ['admin-journals'],
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: ['editor-journals'],
          type: 'active',
        }),
      ]);
      toast.success('Journal updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to update journal');
    },
  });
};
