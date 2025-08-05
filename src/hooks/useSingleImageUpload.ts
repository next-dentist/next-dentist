'use client';

import { uploadSingleImage } from '@/app/actions/uploadSingleImage';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function useSingleImageUpload() {
  const [isPending, start] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File, folder: string) => {
    setError(null);
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      start(async () => {
        try {
          const result = await uploadSingleImage(null, formData);
          resolve(result.path);
        } catch (e) {
          const error = e as Error;
          setError(error);
          toast.error(error.message || 'Failed to upload image');
          reject(error);
        }
      });
    });
  };

  return { upload, isUploading: isPending, error };
} 