'use client';

import { createCostFAQ, deleteCostFAQ, getCostFAQsByCostPageId, updateCostFAQ } from '@/app/actions/costFAQAction';
import { costFaqSchema } from '@/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

// Utility function to handle common mutation success and error logic
function handleMutationSuccess(costPageId: string, action: string) {
  // Note: Not using hooks here to comply with React rules
  toast.success(`${action} successfully`);
}

function handleMutationError(action: string, error: unknown) {
  toast.error(`Failed to ${action}`);
  console.error(`Error during ${action}:`, error);
}

// Hook to fetch FAQs
export const useCostFAQ = (costPageId: string) => {
  return useQuery({
    queryKey: ['cost-faq', costPageId],
    queryFn: () => getCostFAQsByCostPageId(costPageId),
  });
};

// Hook for creating a FAQ
export const useCreateCostFAQ = (costPageId: string) => {
  const queryClient = useQueryClient();  // Called inside the hook, which is correct
  return useMutation({
    mutationFn: (data: z.infer<typeof costFaqSchema>) => createCostFAQ(costPageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-faq', costPageId] });
      handleMutationSuccess(costPageId, 'FAQ created');
    },
    onError: (error) => handleMutationError('create FAQ', error),
  });
};

// Hook for updating a FAQ
export const useUpdateCostFAQ = (costPageId: string) => {
  const queryClient = useQueryClient();  // Called inside the hook, which is correct
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: z.infer<typeof costFaqSchema> }) => updateCostFAQ(costPageId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-faq', costPageId] });
      handleMutationSuccess(costPageId, 'FAQ updated');
    },
    onError: (error) => handleMutationError('update FAQ', error),
  });
};

// Hook for deleting a FAQ
export const useDeleteCostFAQ = (costPageId: string) => {
  const queryClient = useQueryClient();  // Called inside the hook, which is correct
  return useMutation({
    mutationFn: (id: string) => deleteCostFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-faq', costPageId] });
      handleMutationSuccess(costPageId, 'FAQ deleted');
    },
    onError: (error) => handleMutationError('delete FAQ', error),
  });
};
