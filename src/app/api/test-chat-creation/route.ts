import { getOrCreateConversation } from '@/app/actions/chat';
import { auth } from '@/auth';
import { db as prisma } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') || 'create';

    console.log('🧪 Test API called:', { action, userId, currentUser: session.user.id });

    if (action === 'list') {
      // List all conversations for current user
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: session.user.id,
              leftAt: null
            }
          }
        },
        include: {
          participants: {
            where: { leftAt: null },
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true }
              }
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { id: true, content: true, createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        currentUserId: session.user.id,
        conversationCount: conversations.length,
        conversations: conversations.map(conv => ({
          id: conv.id,
          type: conv.type,
          createdAt: conv.createdAt,
          participantCount: conv.participants.length,
          participants: conv.participants.map(p => ({
            userId: p.userId,
            userName: p.user?.name || 'Unknown',
            userRole: p.user?.role || 'Unknown'
          })),
          lastMessage: conv.messages[0] || null
        }))
      });
    }

    if (action === 'dentists') {
      // List some dentist information for debugging
      const dentists = await prisma.dentist.findMany({
        take: 10,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        message: 'Sample dentist information for debugging',
        count: dentists.length,
        dentists: dentists.map(d => ({
          dentistId: d.id,
          dentistName: d.name,
          dentistSpeciality: d.speciality,
          verified: d.verified,
          userId: d.userId,
          userName: d.user.name,
          userEmail: d.user.email,
          userRole: d.user.role
        }))
      });
    }

    if (action === 'create' && userId) {
      // Test conversation creation with dentist ID
      console.log('🧪 Testing conversation creation with dentist ID:', userId);
      
      // First check if this is a dentist ID and get the corresponding user
      console.log('🔍 Looking up dentist by ID...');
      const dentist = await prisma.dentist.findUnique({
        where: { id: userId },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      });

      if (!dentist) {
        console.log('❌ Dentist not found with ID:', userId);
        return NextResponse.json({ 
          error: 'Dentist not found with provided ID',
          providedDentistId: userId,
          suggestion: 'Make sure you are providing a valid dentist ID, not a user ID'
        }, { status: 404 });
      }

      console.log('✅ Found dentist record:', {
        dentistId: dentist.id,
        dentistName: dentist.name,
        userId: dentist.userId,
        userName: dentist.user.name,
        userRole: dentist.user.role
      });

      // Now create conversation using the dentist ID (our server action will resolve it)
      console.log('📞 Calling getOrCreateConversation with dentist ID:', userId);
      const conversation = await getOrCreateConversation(userId);
      
      return NextResponse.json({
        success: true,
        message: 'Conversation created/found successfully using dentist ID',
        currentUserId: session.user.id,
        providedDentistId: userId,
        resolvedUserId: dentist.userId,
        dentistInfo: {
          id: dentist.id,
          name: dentist.name,
          speciality: dentist.speciality,
          verified: dentist.verified
        },
        userInfo: {
          id: dentist.user.id,
          name: dentist.user.name,
          email: dentist.user.email,
          role: dentist.user.role
        },
        conversation: {
          id: conversation.id,
          type: conversation.type,
          createdAt: conversation.createdAt,
          participantCount: conversation.participants.length,
          participants: conversation.participants.map(p => ({
            userId: p.userId,
            userName: p.user?.name || 'Unknown',
            userRole: p.user?.role || 'Unknown',
            isDentist: !!p.user?.Dentist?.length
          }))
        }
      });
    }

    if (action === 'cleanup') {
      // Clean up test conversations (be careful with this!)
      const deletedCount = await prisma.conversation.deleteMany({
        where: {
          participants: {
            some: { userId: session.user.id }
          },
          messages: {
            none: {} // Only delete conversations with no messages
          }
        }
      });

      return NextResponse.json({
        success: true,
        message: `Cleaned up ${deletedCount.count} empty conversations`
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use ?action=list, ?action=dentists, ?action=create&userId=<dentist-id>, or ?action=cleanup'
    }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Test chat creation error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: error.stack 
      }, 
      { status: 500 }
    );
  }
} 