'use client'

import { createAward, deleteAward, readAwards, updateAward } from '@/app/actions/awardsAction';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface AwardFormData {
  "@type": "Award";
  name: string;
  dateAwarded: string;
}

export const useAwards = (dentistId: string) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: awards, isLoading, isError, refetch } = useQuery({
    queryKey: ['awards', dentistId],
    queryFn: async () => {
      const awards = await readAwards(dentistId);
      if (!awards.success) {
        toast.error(awards.error || 'Failed to fetch awards');
        throw new Error(awards.error || 'Failed to fetch awards');
      }
      return awards.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async ({ awardId, awardData }: { awardId: string; awardData: AwardFormData }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateAward(dentistId, awardId, awardData);
        if (!response.success) {
          throw new Error(response.error || 'Failed to update award');
        }
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards', dentistId] });
      toast.success("Award updated successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to update award: ${errorMessage}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newAwards: AwardFormData[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createAward(dentistId, newAwards);
        if (!response.success) {
          throw new Error(response.error || 'Failed to create awards');
        }
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards', dentistId] });
      toast.success("Awards saved successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to save awards: ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (awardId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteAward(dentistId, awardId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete award');
        }
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards', dentistId] });
      toast.success("Award deleted successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete award: ${errorMessage}`);
    },
  });

  return {
    awards,
    isLoading,
    isError,
    error,
    refetch,
    register,
    handleSubmit,
    reset,
    updateMutation,
    createMutation,
    deleteMutation,
    loading,
  };
};



