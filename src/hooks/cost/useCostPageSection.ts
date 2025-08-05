'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import { createCostSection, deleteCostSection, getCostPageSectionById, updateCostSection } from '@/app/actions/CostSectionAction';
import { CostSectionFormValues } from '@/schemas';

export const useCostPageSection = (costPageId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CostSectionFormValues) => {
      const result = await createCostSection(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-section', costPageId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{
      title: string;
      content: string | null;
      image: string | null;
      imageAlt: string | null;
    }> }) =>
      updateCostSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-section', costPageId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCostSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-section', costPageId] });
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCostPageSectionById = (id: string) => {
  return useQuery({
    queryKey: ['cost-page-section', id],
    queryFn: async () => {
      const response = await getCostPageSectionById(id);
      return response;
    },
  });
};


