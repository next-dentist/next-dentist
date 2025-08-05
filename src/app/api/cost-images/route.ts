import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { costPageId, imageUrl, imageAlt } = await request.json();

    if (!costPageId || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'costPageId and imageUrl are required' },
        { status: 400 }
      );
    }

    // Create costImages entry for existing media
    const newImage = await db.costImages.create({
      data: {
        image: imageUrl,
        costPageId: costPageId,
        imageAlt: imageAlt || 'Selected from media library',
      },
    });

    return NextResponse.json({
      success: true,
      imageId: newImage.id,
      message: 'Media added to cost page successfully',
    });

  } catch (error) {
    console.error('Cost Images API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add media to cost page',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 