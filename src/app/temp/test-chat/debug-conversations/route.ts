import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    // Get user's conversations
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId, leftAt: null }
        }
      },
      include: {
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      userId,
      conversations: conversations.map(conv => ({
        id: conv.id,
        type: conv.type,
        createdAt: conv.createdAt,
        participants: conv.participants.map(p => ({
          id: p.id,
          userId: p.userId,
          user: p.user,
          leftAt: p.leftAt
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 