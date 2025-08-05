// hooks/useCostImagesUpload.ts
'use client';

import { getCostImages, uploadCostImages } from '@/app/actions/uploadCostImages';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';

export function useCostImagesUpload() {
  const [isPending, start] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const upload = async (files: File[], costPageId: string) => {
    setError(null);
    return new Promise<string[]>((resolve, reject) => {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      fd.append('costPageId', costPageId);

      start(async () => {
        try {
          const paths = await uploadCostImages(null, fd);
          // Invalidate the cost images query to trigger a refresh
          queryClient.invalidateQueries({ queryKey: ['costImages', costPageId] });
          resolve(paths);
        } catch (e) {
          setError(e as Error);
          reject(e);
        }
      });
    });
  };

  const getImages = async (costPageId: string) => {
    try {
      const images = await getCostImages(costPageId);
      return images;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return { upload, getImages, isUploading: isPending, error };
}
