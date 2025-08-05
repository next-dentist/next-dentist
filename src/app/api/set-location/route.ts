import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const schema = z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      ts: z.number()
    });
    
    const data = schema.parse(body);
    
    // Create response with cookie
    const response = NextResponse.json({ success: true });
    
    // Set cookie on response - accessible to JavaScript for client-side location detection
    response.cookies.set('geo', JSON.stringify(data), { 
      maxAge: 60*60*24*3, // 3 days
      path: '/',
      httpOnly: false, // Allow JavaScript access for client-side location checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Error setting location:', error);
    return NextResponse.json({ success: false, error: 'Invalid location data' }, { status: 400 });
  }
} 