'use client'

import { readTimeZone, updateTimeZone } from '@/app/actions/timeZoneAction';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { toast } from 'sonner';

export const useTimeZone = (dentistId: string) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: timezone, isLoading, isError, refetch } = useQuery({
    queryKey: ['timezone', dentistId],
    queryFn: async () => {
      try {
        const response = await readTimeZone(dentistId);
        if (!response.success) {
          toast.error(response.error || 'Failed to fetch timezone');
          throw new Error(response.error || 'Failed to fetch timezone');
        }
        return response.data || Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        console.error('Error fetching timezone:', error);
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (newTimezone: string) => {
      setLoading(true);
      setError(null);
      try {
        // Validate input
        if (!newTimezone) {
          throw new Error('Timezone is required');
        }

        const response = await updateTimeZone(dentistId, newTimezone);
        if (!response.success) {
          console.error('Server error:', response.error);
          throw new Error(response.error || 'Failed to update timezone');
        }
        return response;
      } catch (err) {
        console.error('Error in updateMutation:', err);
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['timezone', dentistId] });
        await refetch();
        toast.success("Timezone updated successfully");
      } catch (err) {
        console.error('Error in onSuccess:', err);
        toast.error('Failed to refresh timezone data');
      }
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error('Mutation error:', err);
      toast.error(`Failed to update timezone: ${errorMessage}`);
    },
  });

  return {
    timezone,
    isLoading,
    isError,
    error,
    refetch,
    updateMutation,
    loading,
  };
}; 