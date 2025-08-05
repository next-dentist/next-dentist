'use client';

// hook to handle the social media links

import { createSocialLinks, deleteSocialLinks, readSocialLinks, updateSocialLinks } from '@/app/actions/socialMediaLinks';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useSocialLinks = (dentistId: string) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: socialLinks, isLoading, isError, refetch } = useQuery({
    queryKey: ['social-links', dentistId],
    queryFn: async () => {
      const links = await readSocialLinks(dentistId);
      if (!links.success) {
        toast.error(links.error || 'Failed to fetch social links');
        throw new Error(links.error || 'Failed to fetch social links');
      }
      return links.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedLinks: unknown) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateSocialLinks(dentistId, updatedLinks);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links', dentistId] });
      toast.success("Social links updated successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to update social links: ${errorMessage}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newLink: unknown) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createSocialLinks(dentistId, newLink);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links', dentistId] });
      toast.success("Social link created successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to create social link: ${errorMessage}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteSocialLinks(dentistId);
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links', dentistId] });
      toast.success("Social link deleted successfully");
    },
    onError: (err: Error) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to delete social link: ${errorMessage}`);
    },
  });

  return {
    socialLinks,
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
