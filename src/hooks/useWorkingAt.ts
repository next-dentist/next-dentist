'use client'

import { createWorkingAt, deleteWorkingAt, readWorkingAt } from '@/app/actions/workingAtAction';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface WorkingAtFormData {
  "@type": "Organization";
  name: string;
  sameAs: string;
  position: string;
  startDate: string;
  endDate?: string;
}

export const useWorkingAt = (dentistId: string) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: workingAt, isLoading, isError, refetch } = useQuery({
    queryKey: ['workingAt', dentistId],
    queryFn: async () => {
      try {
        const workingAt = await readWorkingAt(dentistId);
        if (!workingAt.success) {
          toast.error(workingAt.error || 'Failed to fetch working places');
          throw new Error(workingAt.error || 'Failed to fetch working places');
        }
        return workingAt.data || [];
      } catch (error) {
        console.error('Error fetching working places:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: async (newWorkingAt: WorkingAtFormData[]) => {
      setLoading(true);
      setError(null);
      try {
        // Validate input data
        if (!Array.isArray(newWorkingAt) || newWorkingAt.length === 0) {
          throw new Error('Invalid input: working places data must be a non-empty array');
        }

        // Ensure all required fields are present and properly formatted
        const validatedData: WorkingAtFormData[] = newWorkingAt.map(place => {
          if (!place.name || !place.sameAs || !place.position || !place.startDate) {
            throw new Error('Missing required fields in working place data');
          }
          return {
            "@type": "Organization" as const,
            name: place.name.trim(),
            sameAs: place.sameAs.trim(),
            position: place.position.trim(),
            startDate: place.startDate,
            endDate: place.endDate || undefined,
          };
        });

        const response = await createWorkingAt(dentistId, validatedData);
        
        if (!response.success) {
          console.error('Server error:', response.error);
          throw new Error(response.error || 'Failed to create working places');
        }
        return response;
      } catch (err) {
        console.error('Error in createMutation:', err);
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data) => {
      try {
        // Invalidate and refetch the data
        await queryClient.invalidateQueries({ queryKey: ['workingAt', dentistId] });
        await refetch();
        toast.success("Working places saved successfully");
      } catch (err) {
        console.error('Error in onSuccess:', err);
        toast.error('Failed to refresh working places data');
      }
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error('Mutation error:', err);
      toast.error(`Failed to save working places: ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (workingAtId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteWorkingAt(dentistId, workingAtId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete working place');
        }
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async () => {
      // Invalidate and refetch the data
      await queryClient.invalidateQueries({ queryKey: ['workingAt', dentistId] });
      await refetch();
      toast.success("Working place deleted successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete working place: ${errorMessage}`);
    },
  });

  return {
    workingAt: workingAt || [],
    isLoading,
    isError,
    error,
    refetch,
    register,
    handleSubmit,
    reset,
    createMutation,
    deleteMutation,
    loading,
  };
}; 