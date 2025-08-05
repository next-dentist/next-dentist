'use client';

import { addCostVideo, deleteCostVideo, getCostVideos, updateCostVideo } from '@/app/actions/cost/video';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Helper function to validate video URLs
const isValidVideoUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;
  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

export function useCostVideos(costPageId: string) {
  const queryClient = useQueryClient();

  const useFetchCostVideos = () => {
    return useQuery({
      queryKey: ['costVideos', costPageId],
      queryFn: async () => {
        try {
          const videos = await getCostVideos(costPageId);
          return videos;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      },
    });
  };

  const useAddCostVideo = () => {
    return useMutation({
      mutationFn: async (data: { video: string; videoAlt?: string }) => {
        if (!isValidVideoUrl(data.video)) {
          throw new Error('Invalid video URL. Only YouTube and Vimeo links are supported.');
        }

        try {
          const response = await addCostVideo(costPageId, data);
          if (!response.success) {
            throw new Error(response.error);
          }
          return response.data;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costVideos', costPageId] });
        toast.success('Video added successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to add video');
      },
    });
  };

  const useDeleteCostVideo = () => {
    return useMutation({
      mutationFn: async (videoId: string) => {
        try {
          const response = await deleteCostVideo(videoId);
          if (!response.success) {
            throw new Error(response.error);
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costVideos', costPageId] });
        toast.success('Video deleted successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete video');
      },
    });
  };

  const useUpdateCostVideo = () => {
    return useMutation({
      mutationFn: async ({ videoId, data }: { videoId: string; data: { videoAlt?: string } }) => {
        try {
          const response = await updateCostVideo(videoId, data);
          if (!response.success) {
            throw new Error(response.error);
          }
          return response.data;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costVideos', costPageId] });
        toast.success('Video updated successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update video');
      },
    });
  };

  return {
    useFetchCostVideos,
    useAddCostVideo,
    useDeleteCostVideo,
    useUpdateCostVideo,
  };
}