'use client';
import { deleteMedia } from '@/app/(actions)/media/delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Eye, MoreVertical, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
};

type Props = {
  media: MediaItem;
  onSelect?: (url: string) => void;
  isSelected?: boolean;
  showDetails?: boolean;
  managementMode?: boolean;
};

// Format file size helper
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Format date helper
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export function MediaCard({
  media,
  onSelect,
  isSelected = false,
  showDetails = false,
  managementMode = false,
}: Props) {
  const qc = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const { mutate: remove } = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      return deleteMedia(media.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
      toast.success('Media deleted successfully');
    },
    onError: (e: any) => {
      toast.error(e.message || 'Failed to delete media');
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete "${media.filename}"?`)
    ) {
      remove();
    }
  };

  const handleSelect = () => {
    onSelect?.(media.url);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  const isImage = media.mimeType.startsWith('image/');
  const isVideo = media.mimeType.startsWith('video/');

  return (
    <>
      <div
        className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
          isSelected
            ? 'border-primary bg-primary/10 ring-primary/20 ring-2'
            : 'border-border hover:border-border/80'
        } ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
        onClick={handleSelect}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        aria-label={`Select ${media.filename}`}
      >
        {/* Media Preview */}
        <div className="bg-muted relative aspect-square">
          {isImage ? (
            <Image
              src={media.url}
              alt={media.filename}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 200px"
            />
          ) : isVideo ? (
            <div className="bg-foreground/80 text-background flex h-full items-center justify-center text-4xl">
              🎥
            </div>
          ) : (
            <div className="bg-foreground/60 text-background flex h-full items-center justify-center text-2xl">
              📄
            </div>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <div className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full p-1">
              <Check size={12} />
            </div>
          )}

          {/* Management Mode Actions */}
          {managementMode && (
            <div className="absolute top-2 right-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="bg-background/90 text-foreground hover:bg-background rounded-full p-1.5 shadow-sm transition-colors"
                title="More actions"
              >
                <MoreVertical size={14} />
              </button>

              {/* Actions Dropdown */}
              {showActions && (
                <div className="border-border bg-popover absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border py-1 shadow-lg">
                  {isImage && (
                    <button
                      onClick={handlePreview}
                      className="text-popover-foreground hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-sm"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Click outside to close actions */}
          {showActions && (
            <div
              className="fixed inset-0 z-5"
              onClick={e => {
                e.stopPropagation();
                setShowActions(false);
              }}
            />
          )}
        </div>

        {/* Media Details */}
        {showDetails && (
          <div className="bg-background p-3">
            <h3
              className="text-foreground truncate text-sm font-medium"
              title={media.filename}
            >
              {media.filename}
            </h3>
            <div className="text-muted-foreground mt-1 space-y-1 text-xs">
              <div>{formatFileSize(media.size)}</div>
              <div>{formatDate(media.createdAt)}</div>
              {media.width && media.height && (
                <div>
                  {media.width} × {media.height}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-h-screen max-w-4xl p-4">
            <button
              onClick={() => setShowPreview(false)}
              className="bg-background/20 text-foreground hover:bg-background/30 absolute top-2 right-2 rounded-full p-2 backdrop-blur-sm"
            >
              <X size={20} />
            </button>
            <Image
              src={media.url}
              alt={media.filename}
              width={800}
              height={600}
              className="max-h-[80vh] rounded-lg object-contain"
            />
            <div className="text-primary-foreground absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
              <div className="font-medium">{media.filename}</div>
              <div className="text-muted-foreground text-sm">
                {formatFileSize(media.size)} • {formatDate(media.createdAt)}
                {media.width &&
                  media.height &&
                  ` • ${media.width} × ${media.height}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
