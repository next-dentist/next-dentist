'use client';

import { createCostTable, createTableSet, deleteCostTable, getCostPageTableById, getTableSetsByCostPageId, updateCostTable } from '@/app/actions/CostTableAction';
import { CostTableFormValues } from '@/schemas';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCostPageTable = (costPageId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CostTableFormValues) => {
      const result = await createCostTable(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-table', costPageId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostTableFormValues> }) => 
      updateCostTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-table', costPageId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCostTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-table', costPageId] });
    },
  });

  const createTableSetMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; costPageId: string }) => {
      const result = await createTableSet(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-page-table', costPageId] });
      queryClient.invalidateQueries({ queryKey: ['table-sets', costPageId] });
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    createTableSet: createTableSetMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCostPageTableById = (id: string) => {
  return useQuery({
    queryKey: ['cost-page-table', id],
    queryFn: async () => {
      const response = await getCostPageTableById(id);
      return response;
    },
  });
};

export const useTableSets = (costPageId: string) => {
  return useQuery({
    queryKey: ['table-sets', costPageId],
    queryFn: async () => {
      const response = await getTableSetsByCostPageId(costPageId);
      return response;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
