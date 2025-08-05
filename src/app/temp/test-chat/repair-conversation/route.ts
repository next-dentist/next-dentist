import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'conversationId and userId required' }, { status: 400 });
    }

    // Check if conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user is already a participant
    const existingParticipant = conversation.participants.find(p => p.userId === userId);
    if (existingParticipant) {
      return NextResponse.json({
        success: true,
        message: 'User is already a participant',
        conversation
      });
    }

    // Add user as participant
    const newParticipant = await db.conversationParticipant.create({
      data: {
        conversationId,
        userId
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    // Get updated conversation
    const updatedConversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Participant added successfully',
      newParticipant,
      conversation: updatedConversation
    });
  } catch (error) {
    console.error('Error repairing conversation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to repair conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 