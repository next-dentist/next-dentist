'use client';

import { getPublishedBlogs } from '@/app/actions/blogAction';
import { useQuery } from '@tanstack/react-query';

export function useBlogs() {
  const {
    data: blogs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blogs', 'published'],
    queryFn: async () => {
      try {
        const blogs = await getPublishedBlogs();
        return blogs;
      } catch (err) {
        // Optionally, you can log or transform the error here
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    blogs,
    isLoading,
    isError,
    error,
    refetch,
  };
}
