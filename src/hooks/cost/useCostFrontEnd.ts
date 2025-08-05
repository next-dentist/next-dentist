'use client';

import { getCostPageBySlug } from '@/app/actions/cost/CostActionFrontEnd';
import { useQuery } from '@tanstack/react-query';

export const useCostFrontEnd = (slug: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['cost-page', slug],
    queryFn: async () => {
      try {
        return await getCostPageBySlug(slug);
      } catch (err: unknown) {
        console.error('Error fetching cost page:', err);
        throw err;
      }
    },
    enabled: Boolean(slug),
    retry: 1,
  });

  return { data, isLoading, isError, error, refetch };
};
