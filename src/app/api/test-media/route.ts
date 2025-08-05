import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic database connection
    const mediaCount = await db.media.count();
    
    // Get latest 5 media items
    const latestMedia = await db.media.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    // Get all media (for small datasets)
    const allMedia = await db.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      totalCount: mediaCount,
      allMedia: allMedia,
      latestMedia: latestMedia,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test Media Route Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 