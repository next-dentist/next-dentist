'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config';
import {
  useAdminDentistFetch,
  useUpdateDentist,
} from '@/hooks/useAdminDentistEdit';
import { useAdminUpload } from '@/hooks/useAdminUpload';
import { Dentist, Images } from '@prisma/client';
import { Loader2, Pencil, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import LoadingSpinner from '../LoadingSpinner';

// --- Configuration ---
const MAX_FILE_SIZE = siteConfig.GALLERY_MAX_SIZE;
const ALLOWED_FILE_TYPES = siteConfig.GALLERY_IMAGE_TYPES;
const MAX_GALLERY_IMAGES = siteConfig.GALLERY_MAX_IMAGES;
// --- ---

interface AdminGalleryFormProps {
  dentistId: string;
}

// Simple type for gallery images
type GalleryImage = {
  id: string;
  url: string;
};

// Define the extended Dentist type with images
type DentistWithImages = Dentist & {
  images: Images[];
};

// Define the update data type that can include images operations
type DentistUpdateData = Partial<Dentist> & {
  images?: {
    create?: Array<{
      url: string;
      alt?: string;
      height?: number;
      width?: number;
    }>;
    deleteMany?: Array<{ id: string }>;
  };
};

const AdminGalleryForm: React.FC<AdminGalleryFormProps> = ({ dentistId }) => {
  const { mutate: updateDentist, isPending: isUpdating } = useUpdateDentist();
  const {
    data: dentist,
    isLoading,
    error,
  } = useAdminDentistFetch(dentistId || '') as {
    data: DentistWithImages | undefined;
    isLoading: boolean;
    error: any;
  };
  const { uploadFiles } = useAdminUpload();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initialImages, setInitialImages] = useState<Images[]>([]);
  const [currentImages, setCurrentImages] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (dentist && dentist.images) {
      const mappedGallery = dentist.images.map((img: Images) => ({
        id: img.id,
        url: img.url,
      }));
      setCurrentImages(mappedGallery);
      setInitialImages(dentist.images);
    }
  }, [dentist]);

  const totalImageCount = currentImages.length;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const filesToUpload: File[] = [];
    let validationError = false;

    if (currentImages.length + files.length > MAX_GALLERY_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_GALLERY_IMAGES} images.`);
      validationError = true;
    } else {
      files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File "${file.name}" exceeds the size limit.`);
          validationError = true;
        } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          toast.error(`File "${file.name}" has an unsupported type.`);
          validationError = true;
        } else {
          filesToUpload.push(file);
        }
      });
    }

    if (!validationError && filesToUpload.length > 0) {
      setIsUploading(true);
      try {
        const uploadResults = await uploadFiles(filesToUpload, dentistId);
        if (uploadResults && uploadResults.length > 0) {
          const newImagesForForm = uploadResults.map(result => ({
            id: result.imageId,
            url: result.url,
          }));
          setCurrentImages(prevImages => [...prevImages, ...newImagesForForm]);
        }
      } catch (error) {
        console.error('Upload process error:', error);
        toast.error('An unexpected error occurred during upload.');
      } finally {
        setIsUploading(false);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: {
          files: event.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileChange(fakeEvent);
      event.dataTransfer.clearData();
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    const updatedImages = currentImages.filter(img => img.id !== idToRemove);
    setCurrentImages(updatedImages);
    toast.info('Image marked for removal. Save changes to confirm.');
  };

  const handleUploadAndSave = async () => {
    setIsUploading(true);
    try {
      const initialIds = initialImages.map(img => img.id);
      const currentIdsInForm = currentImages.map(img => img.id);
      const idsToDelete = initialIds.filter(
        id => !currentIdsInForm.includes(id)
      );
      const imagesToCreate = currentImages
        .filter(img => !initialIds.includes(img.id))
        .map(img => ({ url: img.url }));

      const updateData: any = {};
      let hasChanges = false;

      if (idsToDelete.length > 0 || imagesToCreate.length > 0) {
        updateData.images = {};
        hasChanges = true;
        if (idsToDelete.length > 0) {
          updateData.images.deleteMany = idsToDelete.map(id => ({ id }));
        }
        if (imagesToCreate.length > 0) {
          updateData.images.create = imagesToCreate;
        }
      }

      if (hasChanges) {
        await onSubmit(updateData);
      } else {
        toast.info('No changes to save.');
        setIsOpen(false);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error preparing update:', error);
      toast.error('Failed to save changes.');
      setIsUploading(false);
    }
  };

  const onSubmit = async (updateData: DentistUpdateData) => {
    if (dentistId && updateData.images) {
      updateDentist(
        {
          id: dentistId,
          data: updateData as any, // Type assertion to bypass the strict typing
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            setIsUploading(false);
            toast.success('Gallery updated successfully.');
          },
          onError: error => {
            console.error('Gallery Update Error:', error);
            toast.error(`Failed to update gallery: ${error.message}`);
            setIsUploading(false);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading dentist: {error.message}</div>
    );
  }

  if (!dentist) {
    return <div>No dentist found</div>;
  }

  const handleCloseDrawer = () => {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (dentist && dentist.images) {
      const mappedGallery = dentist.images.map((img: Images) => ({
        id: img.id,
        url: img.url,
      }));
      setCurrentImages(mappedGallery);
    }
    setIsOpen(false);
  };

  const FormContent = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <div
          className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 ${
            isUploading || isUpdating || totalImageCount >= MAX_GALLERY_IMAGES
              ? 'opacity-50'
              : ''
          }`}
          onDragOver={handleDragDrop}
          onDrop={handleDragDrop}
        >
          <p className="mb-2 text-center text-gray-500">
            Drag & drop your images here, or click to select files
          </p>
          <input
            type="file"
            multiple
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={
              isUploading || isUpdating || totalImageCount >= MAX_GALLERY_IMAGES
            }
          >
            Select Files
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          Max {MAX_GALLERY_IMAGES} images total. Max{' '}
          {MAX_FILE_SIZE / 1024 / 1024}MB per image. Allowed types: JPG, PNG,
          WEBP, GIF. ({totalImageCount}/{MAX_GALLERY_IMAGES})
        </p>
      </div>

      <div className="grid min-h-[8rem] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {currentImages.map(image => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-md border"
          >
            <Image
              src={image.url}
              alt={`Gallery image`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 z-10 h-6 w-6 opacity-70 transition-opacity group-hover:opacity-100"
              onClick={() => handleRemoveImage(image.id)}
              disabled={isUploading || isUpdating}
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {isUploading && (
          <div className="bg-muted col-span-1 flex aspect-square items-center justify-center rounded-md border">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCloseDrawer}
          disabled={isUploading || isUpdating}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleUploadAndSave}
          disabled={isUploading || isUpdating || !currentImages.length}
        >
          {isUploading || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const ContentsShowUp = () => {
    return (
      <div className="mt-4">
        {currentImages && currentImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {currentImages.map(image => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                <Image
                  src={image.url}
                  alt={`Gallery image`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No gallery images uploaded yet.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">Image Gallery</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Gallery
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={handleCloseDrawer}
          title="Edit Image Gallery"
          side="right"
          width="w-[700px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Upload, view, and remove images for this dentist's gallery.
            </p>
            <FormContent />
          </div>
        </Drawer>

        <ContentsShowUp />
      </div>
    </div>
  );
};

export default AdminGalleryForm;
