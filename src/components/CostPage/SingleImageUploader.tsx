'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSingleImageUpload } from '@/hooks/useSingleImageUpload';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import ImagePopover from './ImagePopover';

interface Props {
  folderName: string;
  imageId?: string;
  imageUrl?: string;
  imageAlt?: string;
  onImageUploaded?: (path: string) => void;
  onImageDeleted?: () => void;
  onImageUpdated?: (alt: string) => void;
  title?: string;
  className?: string;
}

export default function SingleImageUploader({
  folderName,
  imageId,
  imageUrl,
  imageAlt,
  onImageUploaded,
  onImageDeleted,
  onImageUpdated,
  title = 'Image Uploader',
  className = '',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { upload, isUploading, error } = useSingleImageUpload();
  const queryClient = useQueryClient();

  // Reset previewUrl when imageUrl prop changes or is cleared
  useEffect(() => {
    // Clear previewUrl when imageUrl is undefined/empty
    if (!imageUrl) {
      setPreviewUrl(null);
    }
  }, [imageUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const path = await upload(file, folderName);
      onImageUploaded?.(path);

      // Invalidate media queries to refresh MediaPicker
      await queryClient.invalidateQueries({ queryKey: ['media'] });
      await queryClient.refetchQueries({ queryKey: ['media'] });

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setPreviewUrl(null);
    }
  };

  const handleClearSelection = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = ''; // Allow re-selecting the same file
    }
    onImageDeleted?.(); // Signal parent to clear its image field
    toast.info('Image selection cleared');
  };

  const handleDelete = async () => {
    if (!imageId) return;
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      onImageDeleted?.();
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error) {
      toast.error('Failed to delete image');
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async (newAlt: string) => {
    if (!imageId) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageAlt: newAlt }),
      });

      if (!response.ok) throw new Error('Update failed');

      onImageUpdated?.(newAlt);
      toast.success('Image updated successfully');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error) {
      toast.error('Failed to update image');
      console.error('Update error:', error);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Preview
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const path = await upload(file, folderName);
      onImageUploaded?.(path);

      // Invalidate media queries to refresh MediaPicker
      await queryClient.invalidateQueries({ queryKey: ['media'] });
      await queryClient.refetchQueries({ queryKey: ['media'] });

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="hover:bg-muted/40 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition"
        >
          {!imageUrl && !previewUrl ? (
            <>
              <Upload className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-sm">
                Click to upload image or{' '}
                <span className="underline">browse</span> or drag and drop
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                hidden
              />
            </>
          ) : (
            <div className="relative aspect-video w-full">
              <Image
                src={previewUrl || imageUrl || ''}
                alt={imageAlt || ''}
                fill
                className="rounded-xl object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/60 opacity-100 backdrop-blur transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={e => {
                    e.stopPropagation(); // Prevent click-to-upload when clicking button
                    handleClearSelection();
                  }}
                  className="text-white hover:bg-white/20"
                  title="Clear selection"
                >
                  <Trash className="h-8 w-8" />
                </Button>

                {imageId && (
                  <>
                    <ImagePopover
                      imageId={imageId}
                      currentAlt={imageAlt || ''}
                      onUpdate={newAlt => {
                        handleUpdate(newAlt);
                      }}
                      isUpdating={isUploading}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation(); // Prevent click-to-upload
                        handleDelete();
                      }}
                      disabled={isUploading}
                      className="text-white hover:bg-white/20"
                      title="Delete image from server"
                    >
                      <Trash className="h-8 w-8" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-destructive mt-2 text-sm">{error.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
