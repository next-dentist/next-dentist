'use server';
import { db } from "@/db";

export type MediaListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'filename' | 'size';
  sortOrder?: 'asc' | 'desc';
  mimeType?: string;
};

export type MediaListResponse = {
  media: Array<{
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    width?: number | null;
    height?: number | null;
    createdAt: Date;
    uploadedBy?: string | null;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export async function listMedia(params: MediaListParams = {}): Promise<MediaListResponse> {
  const {
    page = 1,
    limit = 20,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    mimeType = ''
  } = params;

  // Build where clause for search and filtering
  const where: any = {};
  
  if (search) {
    where.filename = {
      contains: search,
      mode: 'insensitive'
    };
  }
  
  if (mimeType) {
    where.mimeType = {
      startsWith: mimeType
    };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await db.media.count({ where });
  const totalPages = Math.ceil(total / limit);

  // Fetch media with pagination and sorting
  const media = await db.media.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  return {
    media,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

// Legacy function for backward compatibility
export async function listMediaLegacy() {
  const result = await listMedia({ limit: 1000 });
  return result.media;
}
