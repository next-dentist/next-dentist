'use client';

import { deleteTableSet, getTableSetsByCostPageId, updateTableSet } from '@/app/actions/CostTableAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCostTableSet = (costPageId: string) => {
  const queryClient = useQueryClient();

  const { data: tableSets, isLoading, refetch } = useQuery({
    queryKey: ['table-sets', costPageId],
    queryFn: () => getTableSetsByCostPageId(costPageId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTableSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-sets', costPageId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; slug: string } }) => 
      updateTableSet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-sets', costPageId] });
    },
  });

  return {
    tableSets,
    isLoading,
    refetch,
    deleteTableSet: deleteMutation.mutate,
    updateTableSet: updateMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
