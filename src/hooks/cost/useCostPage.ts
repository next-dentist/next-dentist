// costPageHooks.ts
'use client';

import {
  createCostPage as createCostPageAction,
  deleteCostPage as deleteCostPageAction,
  fetchAllCostPages,
  fetchCostPageById,
  fetchCostPageBySlug,
  updateCostPage as updateCostPageAction,
} from '@/app/actions/costPagesAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCostPage = () => {
  const queryClient = useQueryClient();

  // Fetch all cost pages
  const { data: costPages, isLoading: isLoadingCostPages } = useQuery({
    queryKey: ['costPages'],
    queryFn: fetchAllCostPages,
  });

  // Fetch cost page by ID
  const useFetchCostPageById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['costPage', id],
      queryFn: () => fetchCostPageById(id!),
      enabled: !!id,
    });
  };

  // Fetch cost page by slug
  const useFetchCostPageBySlug = (slug: string | undefined) => {
    return useQuery({
      queryKey: ['costPage', slug],
      queryFn: () => fetchCostPageBySlug(slug!),
      enabled: !!slug,
    });
  };

  // Create cost page mutation
  const createCostPageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createCostPageAction(formData);
      
      // Handle server-side errors
      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(result.error);
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costPages'] });
      toast.success('Cost page created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create cost page', { description: error.message });
    },
  });

  // Update cost page mutation
  const updateCostPageMutation = useMutation({
    mutationFn: (data: { formData: FormData; id: string }) => {
      return updateCostPageAction(data.formData, data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costPages'] });
      toast.success('Cost page updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update cost page', { description: error.message });
    },
  });

  // Delete cost page mutation
  const deleteCostPageMutation = useMutation({
    mutationFn: deleteCostPageAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costPages'] });
      toast.success('Cost page deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete cost page', { description: error.message });
    },
  });

  return {
    costPages,
    isLoadingCostPages,
    useFetchCostPageById,
    useFetchCostPageBySlug,
    createCostPage: createCostPageMutation.mutate,
    updateCostPage: updateCostPageMutation.mutate,
    deleteCostPage: deleteCostPageMutation.mutate,
  };
};