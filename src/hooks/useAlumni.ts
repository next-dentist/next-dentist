'use client'

import { createAlumni, deleteAlumni, readAlumni } from '@/app/actions/alumniAction';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface AlumniFormData {
  "@type": "CollegeOrUniversity";
  name: string;
  sameAs: string;
}

export const useAlumni = (dentistId: string) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: alumni, isLoading, isError, refetch } = useQuery({
    queryKey: ['alumni', dentistId],
    queryFn: async () => {
      const alumni = await readAlumni(dentistId);
      if (!alumni.success) {
        toast.error(alumni.error || 'Failed to fetch alumni');
        throw new Error(alumni.error || 'Failed to fetch alumni');
      }
      return alumni.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: async (newAlumni: AlumniFormData[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createAlumni(dentistId, newAlumni);
        if (!response.success) {
          throw new Error(response.error || 'Failed to create alumni');
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
      queryClient.invalidateQueries({ queryKey: ['alumni', dentistId] });
      toast.success("Alumni saved successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to save alumni: ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (alumniId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteAlumni(dentistId, alumniId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete alumni');
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
      queryClient.invalidateQueries({ queryKey: ['alumni', dentistId] });
      toast.success("Alumni deleted successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete alumni: ${errorMessage}`);
    },
  });

  return {
    alumni,
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