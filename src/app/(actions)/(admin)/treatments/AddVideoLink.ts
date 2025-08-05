'use server';

import { db } from '@/db';
import { z } from 'zod';

// Zod schema for video link validation
const addVideoLinkSchema = z.object({
  url: z
    .string()
    .min(1, 'Video URL is required')
    .url('Please provide a valid URL')
    .refine(
      (url) => {
        // Allow common video platforms and general URLs
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
        return videoPatterns.some((pattern) => pattern.test(url)) || url.startsWith('http');
      },
      'Please provide a valid video URL'
    ),
  image: z
    .string()
    .url('Please provide a valid image URL')
    .optional()
    .nullable(),
  imageAlt: z
    .string()
    .max(200, 'Image alt text must be less than 200 characters')
    .optional()
    .nullable(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
  treatmentMetaId: z
    .string()
    .min(1, 'Treatment ID is required')
    .cuid('Invalid treatment ID format'),
});

// Schema for fetching videos
const getVideosSchema = z.object({
  treatmentMetaId: z
    .string()
    .min(1, 'Treatment ID is required')
    .cuid('Invalid treatment ID format'),
});

export type AddVideoLinkInput = z.infer<typeof addVideoLinkSchema>;
export type GetVideosInput = z.infer<typeof getVideosSchema>;

export interface AddVideoLinkResponse {
  success: boolean;
  message: string;
  video?: {
    id: string;
    url: string;
    image: string | null;
    imageAlt: string | null;
    description: string | null;
    treatmentMetaId: string | null;
  };
  error?: string;
  details?: string[];
}

export interface GetVideosResponse {
  success: boolean;
  message: string;
  videos?: {
    id: string;
    url: string;
    image: string | null;
    imageAlt: string | null;
    description: string | null;
    treatmentMetaId: string | null;
  }[];
  error?: string;
}

export async function addVideoLink(
  input: AddVideoLinkInput
): Promise<AddVideoLinkResponse> {
  try {
    // Validate input data
    const validationResult = addVideoLinkSchema.safeParse(input);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => `${error.path.join('.')}: ${error.message}`
      );
      
      return {
        success: false,
        message: 'Validation failed',
        error: 'Invalid input data provided',
        details: errorMessages,
      };
    }

    const { url, image, imageAlt, description, treatmentMetaId } = validationResult.data;

    // Check if treatment exists
    const treatmentExists = await db.treatmentMeta.findUnique({
      where: { id: treatmentMetaId },
      select: { id: true, name: true },
    });

    if (!treatmentExists) {
      return {
        success: false,
        message: 'Treatment not found',
        error: `Treatment with ID ${treatmentMetaId} does not exist`,
      };
    }

    // Check if video URL already exists for this treatment
    const existingVideo = await db.treatmentVideos.findFirst({
      where: {
        url: url,
        treatmentMetaId: treatmentMetaId,
      },
    });

    if (existingVideo) {
      return {
        success: false,
        message: 'Video already exists',
        error: 'This video URL is already associated with this treatment',
      };
    }

    // Create the video record
    const newVideo = await db.treatmentVideos.create({
      data: {
        url,
        image: image || null,
        imageAlt: imageAlt || null,
        description: description || null,
        treatmentMetaId,
      },
    });

    return {
      success: true,
      message: 'Video link added successfully',
      video: {
        id: newVideo.id,
        url: newVideo.url || '',
        image: newVideo.image,
        imageAlt: newVideo.imageAlt,
        description: newVideo.description,
        treatmentMetaId: newVideo.treatmentMetaId,
      },
    };

  } catch (error) {
    console.error('Error adding video link:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      // Handle Prisma unique constraint violations
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          message: 'Duplicate video link',
          error: 'This video link already exists for this treatment',
        };
      }

      // Handle foreign key constraint violations
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          message: 'Invalid treatment reference',
          error: 'The specified treatment does not exist',
        };
      }

      // Handle database connection errors
      if (error.message.includes('connection') || error.message.includes('timeout')) {
        return {
          success: false,
          message: 'Database connection error',
          error: 'Unable to connect to the database. Please try again later.',
        };
      }
    }

    // Generic error fallback
    return {
      success: false,
      message: 'Failed to add video link',
      error: 'An unexpected error occurred while adding the video link',
      details: process.env.NODE_ENV === 'development' && error instanceof Error
        ? [error.message]
        : undefined,
    };
  }
}

// Server action to get video links for a treatment
export async function getVideoLinks(
  input: GetVideosInput
): Promise<GetVideosResponse> {
  try {
    // Validate input data
    const validationResult = getVideosSchema.safeParse(input);
    
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        error: 'Invalid treatment ID provided',
      };
    }

    const { treatmentMetaId } = validationResult.data;

    // Check if treatment exists
    const treatmentExists = await db.treatmentMeta.findUnique({
      where: { id: treatmentMetaId },
      select: { id: true, name: true },
    });

    if (!treatmentExists) {
      return {
        success: false,
        message: 'Treatment not found',
        error: `Treatment with ID ${treatmentMetaId} does not exist`,
      };
    }

    // Fetch all videos for this treatment
    const videos = await db.treatmentVideos.findMany({
      where: { treatmentMetaId },
      orderBy: { id: 'desc' }, // Latest first
      select: {
        id: true,
        url: true,
        image: true,
        imageAlt: true,
        description: true,
        treatmentMetaId: true,
      },
    });

    return {
      success: true,
      message: 'Videos fetched successfully',
      videos: videos.map(video => ({
        id: video.id,
        url: video.url || '',
        image: video.image,
        imageAlt: video.imageAlt,
        description: video.description,
        treatmentMetaId: video.treatmentMetaId,
      })),
    };

  } catch (error) {
    console.error('Error fetching video links:', error);

    // Handle database connection errors
    if (error instanceof Error && 
        (error.message.includes('connection') || error.message.includes('timeout'))) {
      return {
        success: false,
        message: 'Database connection error',
        error: 'Unable to connect to the database. Please try again later.',
      };
    }

    // Generic error fallback
    return {
      success: false,
      message: 'Failed to fetch video links',
      error: 'An unexpected error occurred while fetching video links',
    };
  }
}

// Server action to delete a video link
export async function deleteVideoLink(videoId: string): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Validate video ID
    if (!videoId || typeof videoId !== 'string') {
      return {
        success: false,
        message: 'Invalid video ID',
        error: 'Video ID is required and must be a valid string',
      };
    }

    // Check if video exists
    const existingVideo = await db.treatmentVideos.findUnique({
      where: { id: videoId },
      select: { id: true, treatmentMetaId: true },
    });

    if (!existingVideo) {
      return {
        success: false,
        message: 'Video not found',
        error: `Video with ID ${videoId} does not exist`,
      };
    }

    // Delete the video
    await db.treatmentVideos.delete({
      where: { id: videoId },
    });

    return {
      success: true,
      message: 'Video deleted successfully',
    };

  } catch (error) {
    console.error('Error deleting video link:', error);

    // Handle database connection errors
    if (error instanceof Error && 
        (error.message.includes('connection') || error.message.includes('timeout'))) {
      return {
        success: false,
        message: 'Database connection error',
        error: 'Unable to connect to the database. Please try again later.',
      };
    }

    // Generic error fallback
    return {
      success: false,
      message: 'Failed to delete video link',
      error: 'An unexpected error occurred while deleting the video link',
    };
  }
}

// Helper function to validate video URL format
export async function isValidVideoUrl(url: string): Promise<boolean> {
  try {
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
    return videoPatterns.some((pattern) => pattern.test(url)) || url.startsWith('http');
  } catch {
    return false;
  }
}

// Helper function to extract video metadata (can be extended)
export async function getVideoMetadata(url: string): Promise<{ platform?: string; videoId?: string }> {
  try {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return { platform: 'youtube', videoId };
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return { platform: 'vimeo', videoId };
    }
    
    return {};
  } catch {
    return {};
  }
}

