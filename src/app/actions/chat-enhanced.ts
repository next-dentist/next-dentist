"use server";

import { auth } from "@/auth";
import { db as prisma } from "@/db";
import { revalidatePath } from "next/cache";

// Enhanced conversation creation with detailed logging and validation
export async function createConversationEnhanced(participantUserId: string) {
  try {
    console.log('🚀 Enhanced conversation creation started');
    
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const currentUserId = session.user.id;
    console.log('📋 Current user:', currentUserId);
    console.log('🎯 Target user:', participantUserId);

    // Validate inputs
    if (!participantUserId || typeof participantUserId !== 'string') {
      throw new Error('Invalid participant user ID');
    }

    if (currentUserId === participantUserId) {
      throw new Error('Cannot create conversation with yourself');
    }

    // Verify target user exists and is a dentist
    const targetUser = await prisma.user.findUnique({
      where: { id: participantUserId },
      include: {
        Dentist: {
          select: {
            id: true,
            name: true,
            speciality: true,
            verified: true,
          }
        }
      }
    });

    if (!targetUser) {
      throw new Error(`Target user not found: ${participantUserId}`);
    }

    console.log('✅ Target user found:', {
      id: targetUser.id,
      name: targetUser.name,
      role: targetUser.role,
      isDentist: targetUser.Dentist.length > 0
    });

    // Check for existing conversation
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { type: 'DIRECT' },
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: participantUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              include: {
                Dentist: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    speciality: true,
                    verified: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              include: {
                Dentist: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
            attachments: true,
          },
        },
      },
    });

    if (existingConversation) {
      console.log('✅ Found existing conversation:', existingConversation.id);
      return existingConversation;
    }

    // Create new conversation
    console.log('🆕 Creating new conversation...');
    const newConversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            { userId: currentUserId },
            { userId: participantUserId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              include: {
                Dentist: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    speciality: true,
                    verified: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              include: {
                Dentist: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
            attachments: true,
          },
        },
      },
    });

    console.log('✅ New conversation created:', newConversation.id);
    
    // Revalidate the chat page
    revalidatePath('/chat');
    
    return newConversation;

  } catch (error: any) {
    console.error('❌ Enhanced conversation creation failed:', error);
    throw new Error(`Conversation creation failed: ${error.message}`);
  }
}

// Test function to verify conversation creation
export async function testConversationCreation(dentistUserId: string) {
  try {
    console.log('🧪 Testing conversation creation with dentist userId:', dentistUserId);
    
    // First verify the dentist exists
    const dentist = await prisma.dentist.findFirst({
      where: { userId: dentistUserId },
      include: { user: true }
    });
    
    if (!dentist) {
      throw new Error('Dentist not found with the provided userId');
    }
    
    console.log('✅ Dentist found:', {
      dentistId: dentist.id,
      dentistName: dentist.name,
      userId: dentist.userId,
      userName: dentist.user.name
    });
    
    // Now test conversation creation
    const conversation = await createConversationEnhanced(dentistUserId);
    
    return {
      success: true,
      conversation: {
        id: conversation.id,
        type: conversation.type,
        participantCount: conversation.participants.length
      },
      message: 'Conversation created successfully'
    };
    
  } catch (error: any) {
    console.error('🧪 Test failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
} 