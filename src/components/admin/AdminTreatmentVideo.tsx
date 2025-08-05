'use client';

import {
  addVideoLink,
  deleteVideoLink,
  getVideoLinks,
  type AddVideoLinkInput,
} from '@/app/(actions)/(admin)/treatments/AddVideoLink';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Eye,
  Loader2,
  Play,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Form validation schema (matches the server action schema)
const videoFormSchema = z.object({
  url: z
    .string()
    .min(1, 'Video URL is required')
    .url('Please provide a valid URL')
    .refine(url => {
      const videoPatterns = [
        /youtube\.com\/watch\?v=/,
        /youtu\.be\//,
        /vimeo\.com\//,
        /dailymotion\.com\//,
        /wistia\.(net|com)/,
        /\.mp4$/i,
        /\.webm$/i,
        /\.ogg$/i,
      ];
      return (
        videoPatterns.some(pattern => pattern.test(url)) ||
        url.startsWith('http')
      );
    }, 'Please provide a valid video URL (YouTube, Vimeo, etc.)'),
  image: z
    .string()
    .url('Please provide a valid image URL')
    .optional()
    .or(z.literal('')),
  imageAlt: z
    .string()
    .max(200, 'Image alt text must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

type VideoFormData = z.infer<typeof videoFormSchema>;

interface TreatmentVideo {
  id: string;
  url: string;
  image: string | null;
  imageAlt: string | null;
  description: string | null;
  treatmentMetaId: string | null;
}

interface AdminTreatmentVideoProps {
  treatmentMetaId: string;
  treatmentName?: string;
  onVideoAdded?: (video: any) => void;
  onVideoDeleted?: (videoId: string) => void;
  className?: string;
}

export default function AdminTreatmentVideo({
  treatmentMetaId,
  treatmentName,
  onVideoAdded,
  onVideoDeleted,
  className = '',
}: AdminTreatmentVideoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    details?: string[];
  }>({ type: null, message: '' });

  const queryClient = useQueryClient();

  // Query to fetch videos
  const {
    data: videosResponse,
    isLoading: isLoadingVideos,
    error: videosError,
  } = useQuery({
    queryKey: ['treatment-videos', treatmentMetaId],
    queryFn: () => getVideoLinks({ treatmentMetaId }),
    enabled: !!treatmentMetaId,
  });

  const videos = videosResponse?.success ? videosResponse.videos || [] : [];

  // Mutation to add video
  const addVideoMutation = useMutation({
    mutationFn: addVideoLink,
    onSuccess: result => {
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });

        reset(); // Clear the form
        setIsDialogOpen(false); // Close dialog

        // Invalidate and refetch videos
        queryClient.invalidateQueries({
          queryKey: ['treatment-videos', treatmentMetaId],
        });

        // Call the callback if provided
        if (onVideoAdded && result.video) {
          onVideoAdded(result.video);
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to add video',
          details: result.details,
        });
      }
    },
    onError: error => {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    },
  });

  // Mutation to delete video
  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideoLink,
    onSuccess: (result, videoId) => {
      if (result.success) {
        // Optimistically update the cache
        queryClient.setQueryData(
          ['treatment-videos', treatmentMetaId],
          (old: any) => {
            if (!old?.success) return old;
            return {
              ...old,
              videos:
                old.videos?.filter(
                  (video: TreatmentVideo) => video.id !== videoId
                ) || [],
            };
          }
        );

        // Call the callback if provided
        if (onVideoDeleted) {
          onVideoDeleted(videoId);
        }
      } else {
        alert(result.error || 'Failed to delete video');
      }
    },
    onError: (error, videoId) => {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');

      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['treatment-videos', treatmentMetaId],
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    mode: 'onChange',
  });

  const watchedUrl = watch('url');

  // Helper function to get video platform
  const getVideoPlatform = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('dailymotion.com')) return 'Dailymotion';
    if (url.includes('wistia')) return 'Wistia';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'Direct Video';
    return 'Video';
  };

  // Get video thumbnail URL
  const getVideoThumbnail = (video: TreatmentVideo): string => {
    if (video.image) return video.image;

    // Try to get YouTube thumbnail
    if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
      const videoId = video.url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      )?.[1];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }

    return '/placeholder-video.jpg'; // fallback image
  };

  const onSubmit = async (data: VideoFormData) => {
    setSubmitStatus({ type: null, message: '' });

    const formData: AddVideoLinkInput = {
      url: data.url,
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      description: data.description || null,
      treatmentMetaId,
    };

    addVideoMutation.mutate(formData);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    deleteVideoMutation.mutate(videoId);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Video className="h-5 w-5" />
            Treatment Videos
          </CardTitle>
          {treatmentName && (
            <p className="text-muted-foreground mt-1 text-sm">
              Videos for: <span className="font-medium">{treatmentName}</span>
            </p>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Add Video Link
              </DialogTitle>
              <DialogDescription>
                Add a new video link to this treatment. Supports YouTube, Vimeo,
                and other video platforms.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status Messages */}
              {submitStatus.type && (
                <Alert
                  variant={
                    submitStatus.type === 'error' ? 'destructive' : 'default'
                  }
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <div className="space-y-1">
                      <p>{submitStatus.message}</p>
                      {submitStatus.details &&
                        submitStatus.details.length > 0 && (
                          <ul className="list-inside list-disc space-y-1 text-xs">
                            {submitStatus.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Video URL Field */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium">
                    Video URL *
                  </Label>
                  <div className="relative">
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      {...register('url')}
                      className={errors.url ? 'border-red-500' : ''}
                    />
                    {watchedUrl && !errors.url && (
                      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {getVideoPlatform(watchedUrl)}
                        </span>
                        <ExternalLink className="text-muted-foreground h-3 w-3" />
                      </div>
                    )}
                  </div>
                  {errors.url && (
                    <p className="text-xs text-red-500">{errors.url.message}</p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Supported: YouTube, Vimeo, Dailymotion, Wistia, or direct
                    video files
                  </p>
                </div>

                {/* Thumbnail Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Thumbnail Image URL
                  </Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/thumbnail.jpg"
                    {...register('image')}
                    className={errors.image ? 'border-red-500' : ''}
                  />
                  {errors.image && (
                    <p className="text-xs text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Optional: Custom thumbnail (auto-generated for YouTube)
                  </p>
                </div>

                {/* Image Alt Text */}
                <div className="space-y-2">
                  <Label htmlFor="imageAlt" className="text-sm font-medium">
                    Image Alt Text
                  </Label>
                  <Input
                    id="imageAlt"
                    type="text"
                    placeholder="Describe the video thumbnail for accessibility"
                    {...register('imageAlt')}
                    className={errors.imageAlt ? 'border-red-500' : ''}
                    maxLength={200}
                  />
                  {errors.imageAlt && (
                    <p className="text-xs text-red-500">
                      {errors.imageAlt.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Video Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the video content..."
                    {...register('description')}
                    className={errors.description ? 'border-red-500' : ''}
                    rows={3}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={addVideoMutation.isPending || !isValid}
                    className="flex items-center gap-2"
                  >
                    {addVideoMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {addVideoMutation.isPending
                      ? 'Adding Video...'
                      : 'Add Video'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setSubmitStatus({ type: null, message: '' });
                    }}
                    disabled={addVideoMutation.isPending}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {/* Handle error state */}
        {videosError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load videos. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {isLoadingVideos ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading videos...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-8 text-center">
            <Video className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No videos added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first video to help patients understand this treatment.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Video
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map(video => (
              <div
                key={video.id}
                className="hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-4 transition-colors"
              >
                {/* Video Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="bg-muted h-16 w-24 overflow-hidden rounded-md">
                    <img
                      src={getVideoThumbnail(video)}
                      alt={video.imageAlt || 'Video thumbnail'}
                      className="h-full w-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-video.jpg';
                      }}
                    />
                    <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity hover:opacity-100">
                      <Play className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="bg-opacity-60 absolute -top-1 -right-1 rounded bg-black px-1.5 py-0.5 text-xs text-[10px] text-white">
                    {getVideoPlatform(video.url)}
                  </div>
                </div>

                {/* Video Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium">
                        {video.description || 'Untitled Video'}
                      </h4>
                      <p className="text-muted-foreground mt-1 truncate text-xs">
                        {video.url}
                      </p>
                      {video.imageAlt && (
                        <p className="text-muted-foreground/80 mt-1 truncate text-xs">
                          Alt: {video.imageAlt}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(video.url, '_blank')}
                        title="Open video"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(video.url, '_blank')}
                        title="Play video"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteVideo(video.id)}
                        disabled={deleteVideoMutation.isPending}
                        title="Delete video"
                      >
                        {deleteVideoMutation.isPending &&
                        deleteVideoMutation.variables === video.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
