'use client';

import ImageCrop from '@/components/ImageCrop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved?: () => void;
  initialImageUrl?: string | null | undefined;
  dentistId?: string;
  treatmentId?: string;
  className?: string;
  aspectRatio?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  uploadEndpoint?: string;
  imageClassName?: string;
  showPreview?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  onImageRemoved,
  initialImageUrl,
  dentistId,
  treatmentId,
  className = '',
  aspectRatio = 1,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploadEndpoint = '/api/upload',
  imageClassName = 'rounded-full',
  showPreview = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(
    initialImageUrl
  );

  useEffect(() => {
    setImageUrl(initialImageUrl);
  }, [initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        setError(
          `Please select a valid image file (${allowedTypes.join(', ')})`
        );
        return;
      }
      // Validate file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`Image size should be less than ${maxSize}MB`);
        return;
      }
      setError(null);
      setFile(selectedFile);
      setShowCropDialog(true);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    setShowCropDialog(false);

    try {
      setIsUploading(true);
      // Convert base64 to file
      const base64Response = await fetch(croppedImageUrl);
      const blob = await base64Response.blob();
      const imageFile = new File([blob], file?.name || 'image.jpg', {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append('file', imageFile);

      // Add optional IDs to formData
      if (dentistId) formData.append('dentistId', dentistId);
      if (treatmentId) formData.append('treatmentId', treatmentId);

      const response = await axios.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setImageUrl(response.data.url);
        onImageUploaded(response.data.url);
        setError(null);
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setShowCropDialog(false);
    setFile(null);
  };

  const handleRemove = async () => {
    setImageUrl(null);
    if (onImageRemoved) onImageRemoved();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {imageUrl && showPreview ? (
        <div className="relative mb-4 h-32 w-32">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'cover' }}
            className={imageClassName}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <Label
            htmlFor="image-upload"
            className="bg-muted hover:bg-muted/80 h-32 w-32 cursor-pointer items-center justify-center rounded-full"
          >
            {isUploading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImagePlus className="text-muted-foreground h-6 w-6" />
                <span className="text-muted-foreground text-sm">
                  Upload Image
                </span>
              </div>
            )}
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept={allowedTypes.join(',')}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
      {error && <p className="text-destructive mt-1 text-sm">{error}</p>}

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Crop Image</DialogTitle>
          {file && (
            <ImageCrop
              image={URL.createObjectURL(file)}
              onCropComplete={handleCropComplete}
              aspectRatio={aspectRatio}
              onCancel={cancelCrop}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
