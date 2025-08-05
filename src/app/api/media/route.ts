import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const media = await db.media.findMany({ 
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to 20 for testing
    });
    
    
    return NextResponse.json({ 
      success: true, 
      count: media.length, 
      data: media 
    });
  } catch (error) {
    console.error('API Media Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 