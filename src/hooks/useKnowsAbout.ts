'use client'

import { createKnowsAbout, deleteKnowsAbout, readKnowsAbout } from '@/app/actions/knowsAboutAction';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface KnowsAboutFormData {
  "@type": "MedicalSpecialty";
  name: string;
  url: string;
}

export const useKnowsAbout = (dentistId: string) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: knowsAbout, isLoading, isError, refetch } = useQuery({
    queryKey: ['knowsAbout', dentistId],
    queryFn: async () => {
      try {
        const knowsAbout = await readKnowsAbout(dentistId);
        if (!knowsAbout.success) {
          toast.error(knowsAbout.error || 'Failed to fetch specialties');
          throw new Error(knowsAbout.error || 'Failed to fetch specialties');
        }
        return knowsAbout.data || [];
      } catch (error) {
        console.error('Error fetching specialties:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: async (newKnowsAbout: KnowsAboutFormData[]) => {
      setLoading(true);
      setError(null);
      try {
        // Validate input data
        if (!Array.isArray(newKnowsAbout) || newKnowsAbout.length === 0) {
          throw new Error('Invalid input: specialties data must be a non-empty array');
        }

        // Ensure all required fields are present and properly formatted
        const validatedData: KnowsAboutFormData[] = newKnowsAbout.map(specialty => {
          if (!specialty.name || !specialty.url) {
            throw new Error('Missing required fields in specialty data');
          }
          return {
            "@type": "MedicalSpecialty" as const,
            name: specialty.name.trim(),
            url: specialty.url.trim(),
          };
        });

        const response = await createKnowsAbout(dentistId, validatedData);
        
        if (!response.success) {
          console.error('Server error:', response.error);
          throw new Error(response.error || 'Failed to create specialties');
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
        await queryClient.invalidateQueries({ queryKey: ['knowsAbout', dentistId] });
        await refetch();
        toast.success("Specialties saved successfully");
      } catch (err) {
        console.error('Error in onSuccess:', err);
        toast.error('Failed to refresh specialties data');
      }
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error('Mutation error:', err);
      toast.error(`Failed to save specialties: ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (specialtyName: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteKnowsAbout(dentistId, specialtyName);
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete specialty');
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
      await queryClient.invalidateQueries({ queryKey: ['knowsAbout', dentistId] });
      await refetch();
      toast.success("Specialty deleted successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete specialty: ${errorMessage}`);
    },
  });

  return {
    knowsAbout: knowsAbout || [],
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