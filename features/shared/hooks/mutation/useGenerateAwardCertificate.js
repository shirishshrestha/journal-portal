import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateAwardCertificate } from '../../api/achievementsApi';
import { toast } from 'sonner';

/**
 * Hook to generate certificate for an award
 */
export const useGenerateAwardCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (awardId) => generateAwardCertificate(awardId),
    onSuccess: (data) => {
      toast.success('Certificate generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Failed to generate certificate';
      toast.error(errorMessage);
    },
  });
};
