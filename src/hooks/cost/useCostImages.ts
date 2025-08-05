'use client';

import { deleteCostImage, getCostImages, updateCostImage } from '@/app/actions/uploadCostImages';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCostImages(costPageId: string) {
  const queryClient = useQueryClient();

  // Fetch images
  const useFetchCostImages = () => {
    return useQuery({
      queryKey: ['costImages', costPageId],
      queryFn: async () => {
        const images = await getCostImages(costPageId);
        return images;
      },
    });
  };

  // Delete image
  const useDeleteCostImage = () => {
    return useMutation({
      mutationFn: async (imageId: string) => {
        const image = await deleteCostImage(imageId);
        return image;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costImages', costPageId] });
        toast.success('Image deleted successfully');
      },
      onError: (error) => {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      },
    });
  };

  // Update image
  const useUpdateCostImage = () => {
    return useMutation({
      mutationFn: async ({
        imageId,
        data,
      }: {
        imageId: string;
        data: { imageAlt?: string };
      }) => {
        const image = await updateCostImage(imageId, data);
        return image;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costImages', costPageId] });
        toast.success('Image updated successfully');
      },
      onError: (error) => {
        console.error('Error updating image:', error);
        toast.error('Failed to update image');
      },
    });
  };

  return {
    useFetchCostImages,
    useDeleteCostImage,
    useUpdateCostImage,
  };
} 