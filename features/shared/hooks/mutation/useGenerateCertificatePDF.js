import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCertificatePDF } from '../../api/achievementsApi';
import { toast } from 'sonner';

/**
 * Hook to generate PDF for a certificate
 */
export const useGenerateCertificatePDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateCertificatePDF,
    onSuccess: (data, certificateId) => {
      toast.success('PDF generation started', {
        description: 'Your certificate PDF is being generated. This may take a moment.',
      });
      
      // Invalidate and refetch certificates
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificate', certificateId] });
    },
    onError: (error) => {
      toast.error('Failed to generate PDF', {
        description: error.response?.data?.message || 'An error occurred while generating the PDF',
      });
    },
  });
};
