import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing dentist data structure...');
    
    // Get a sample dentist to verify data structure
    const sampleDentist = await db.dentist.findFirst({
      where: {
        status: 'verified',
        userId: { not: null }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isOnline: true,
          }
        }
      }
    });
    
    if (!sampleDentist) {
      return NextResponse.json({ error: 'No verified dentist found' }, { status: 404 });
    }
    
    console.log('🧪 Sample dentist data:', {
      dentistId: sampleDentist.id,
      dentistUserId: sampleDentist.userId,
      dentistName: sampleDentist.name,
      userExists: !!sampleDentist.user,
      userName: sampleDentist.user?.name,
      userRole: sampleDentist.user?.role
    });
    
    // Test the same structure as the main API
    const processedDentist = {
      id: sampleDentist.id,
      name: sampleDentist.name,
      userId: sampleDentist.userId, // This is the key field for messaging
      speciality: sampleDentist.speciality,
      image: sampleDentist.image,
      user: sampleDentist.user
    };
    
    return NextResponse.json({
      success: true,
      message: 'Dentist data structure verification',
      sampleDentist: processedDentist,
      hasUserId: !!processedDentist.userId,
      userIdType: typeof processedDentist.userId,
      userExists: !!sampleDentist.user,
      recommendations: {
        chatUrl: `/chat?user=${processedDentist.userId}`,
        testConversationCreation: `/api/test-chat-creation with userId: ${processedDentist.userId}`
      }
    });
    
  } catch (error: any) {
    console.error('🧪 Test API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to test dentist data',
        details: error.stack
      }, 
      { status: 500 }
    );
  }
} 