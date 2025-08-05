// components/MultiImageUploader.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCostImages } from '@/hooks/cost/useCostImages';
import { useCostImagesUpload } from '@/hooks/cost/useCostImageUpload';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { DragEvent, useRef, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import MediaPicker from '../MediaPicker';
import { Button } from '../ui/button';
import ImagePopover from './ImagePopover';

interface Props {
  costPageId: string;
  onComplete?: (paths: string[]) => void;
}

// Unified type for upload queue items
type UploadQueueItem = {
  id: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
  preview: string;
  name: string;
};

export default function MultiImageUploader({ costPageId, onComplete }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [queueItems, setQueueItems] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { upload, error } = useCostImagesUpload();
  const { useFetchCostImages, useDeleteCostImage, useUpdateCostImage } =
    useCostImages(costPageId);
  const { data: images, isLoading, refetch } = useFetchCostImages();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteCostImage();
  const { mutate: updateImage, isPending: isUpdating } = useUpdateCostImage();

  // Generate unique ID for queue items
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Add files from drag/drop or file input
  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map(file => ({
      id: generateId(),
      type: 'file',
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setQueueItems(prev => [...prev, ...newItems]);
  };

  // Add media from MediaPicker
  const addMediaToQueue = (url: string | string[]) => {
    // Handle both single URL and array of URLs
    const urls = Array.isArray(url) ? url : [url];

    urls.forEach(singleUrl => {
      const fileName = singleUrl.split('/').pop() || 'selected-image';
      const newItem: UploadQueueItem = {
        id: generateId(),
        type: 'url',
        url: singleUrl,
        preview: singleUrl,
        name: fileName,
      };
      setQueueItems(prev => [...prev, newItem]);
    });
  };

  // Remove item from queue
  const removeFromQueue = (id: string) => {
    if (isUploading) return;
    setQueueItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Clean up object URLs for file items
      prev.forEach(item => {
        if (item.type === 'file' && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });
      return updated;
    });
  };

  // ── Drag handlers ────────────────────────────────────────────────
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isUploading) return;
    const dropped = Array.from(e.dataTransfer.files);
    addFilesToQueue(dropped);
  };

  const handleUpload = async () => {
    if (!queueItems.length || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Separate file items and URL items
    const fileItems = queueItems.filter(
      item => item.type === 'file' && item.file
    );
    const urlItems = queueItems.filter(item => item.type === 'url' && item.url);

    const totalItems = queueItems.length;
    let completedItems = 0;
    const allResults: string[] = [];

    try {
      // Process file uploads
      if (fileItems.length > 0) {
        const uploadPromises = fileItems.map(async item => {
          const formData = new FormData();
          formData.append('file', item.file!);
          formData.append('costPageId', costPageId);

          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const response = await fetch(`${baseUrl}/api/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
          }

          const result = await response.json();

          // Update progress
          completedItems++;
          setUploadProgress(Math.round((completedItems / totalItems) * 100));

          return result.url;
        });

        const uploadResults = await Promise.all(uploadPromises);
        allResults.push(...uploadResults);
      }

      // Process URL items (create costImages entries for existing media)
      if (urlItems.length > 0) {
        const urlPromises = urlItems.map(async item => {
          const response = await fetch('/api/cost-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              costPageId,
              imageUrl: item.url,
              imageAlt: item.name,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              error.message || 'Failed to add media to cost page'
            );
          }

          // Update progress
          completedItems++;
          setUploadProgress(Math.round((completedItems / totalItems) * 100));

          return item.url!;
        });

        const urlResults = await Promise.all(urlPromises);
        allResults.push(...urlResults);
      }

      // Clean up and complete
      onComplete?.(allResults);

      // Clean up object URLs
      queueItems.forEach(item => {
        if (item.type === 'file' && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });

      setQueueItems([]); // Clear queue
      await refetch(); // Refresh existing images
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (isUploading) return;
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage(imageId);
    }
  };

  const handleUpdateImage = (imageId: string, newAlt: string) => {
    if (isUploading) return;
    updateImage({ imageId, data: { imageAlt: newAlt } });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Image Uploader</CardTitle>
        {isUploading && (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Processing {uploadProgress}%</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Media Picker */}
        <MediaPicker
          trigger={
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isUploading}
            >
              📁 Choose Image From Media Library
            </Button>
          }
          onSelect={addMediaToQueue}
        />

        {/* Drop Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition ${
            isUploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted/40'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="md" />
              <p className="text-sm">Processing files...</p>
            </div>
          ) : (
            <p className="text-sm">
              📎 Drag & drop images here, or{' '}
              <span className="underline">browse</span>
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={e => {
              if (!isUploading && e.target.files) {
                addFilesToQueue(Array.from(e.target.files));
              }
            }}
            disabled={isUploading}
            hidden
          />
        </div>

        {/* Upload Queue */}
        <AnimatePresence>
          {queueItems.length > 0 && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Upload Queue ({queueItems.length} items)
                </h3>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !queueItems.length}
                  size="sm"
                  className="min-w-[100px]"
                >
                  {isUploading ? `${uploadProgress}%` : '🚀 Process All'}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {queueItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="group relative aspect-square w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={item.preview}
                      alt={item.name}
                      fill
                      className={`rounded-xl object-cover ${
                        isUploading ? 'opacity-70' : ''
                      }`}
                    />

                    {/* Type indicator */}
                    <div className="absolute top-1 left-1 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                      {item.type === 'file' ? '📄' : '🔗'}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromQueue(item.id)}
                      className={`absolute top-1 right-1 rounded-full bg-black/60 p-1 backdrop-blur transition-opacity ${
                        isUploading
                          ? 'cursor-not-allowed opacity-30'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                      disabled={isUploading}
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Images */}
        {isLoading ? (
          <div className="mt-4 text-center">
            <LoadingSpinner size="md" />
            <p className="mt-2 text-sm text-gray-500">
              Loading existing images...
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium">
              Existing Images ({images?.length || 0})
            </h3>
            {images && images.length > 0 ? (
              <ul
                className={`grid grid-cols-2 gap-4 md:grid-cols-5 ${
                  isUploading ? 'opacity-50' : ''
                }`}
              >
                {images.map(image => (
                  <li
                    key={image.id}
                    className="group relative aspect-square w-full"
                  >
                    <Image
                      src={image.image}
                      alt={image.imageAlt || ''}
                      fill
                      className="rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ImagePopover
                        imageId={image.id}
                        currentAlt={image.imageAlt || ''}
                        onUpdate={handleUpdateImage}
                        isUpdating={isUpdating}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={isDeleting || isUploading}
                        className="text-white hover:bg-white/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>
                  No images yet. Upload some files or choose from media library!
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-destructive mt-2 text-sm">{error.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
