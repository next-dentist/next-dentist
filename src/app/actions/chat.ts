"use server";

import { auth } from "@/auth";
import { db as prisma } from "@/db";
import { revalidatePath } from "next/cache";

// Get or create a conversation between two users
export async function getOrCreateConversation(participantId: string) {
  try {
    console.log('🚀 getOrCreateConversation started');
    console.log('📋 Input participantId:', participantId);
    
    const session = await auth();
    if (!session?.user?.id) {
      console.error('❌ No session or user ID found');
      throw new Error('Unauthorized');
    }
    const currentUserId = session.user.id;
    
    console.log('📋 Current user ID:', currentUserId);
    console.log('🎯 Target participant ID:', participantId);

    // First, try to find if this is a dentist ID and get the corresponding user ID
    let targetUserId = participantId;
    let participantUser: { id: string; name: string | null; role: string | null } | null = null;
    let resolvedFromDentistId = false;

    // Check if this ID corresponds to a dentist
    console.log('🔍 Step 1: Checking if participantId is a dentist ID...');
    const dentist = await prisma.dentist.findUnique({
      where: { id: participantId },
      include: {
        user: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    if (dentist) {
      console.log('✅ Found dentist record:', {
        dentistId: dentist.id,
        dentistName: dentist.name,
        userId: dentist.userId,
        userName: dentist.user.name
      });
      targetUserId = dentist.userId;
      participantUser = dentist.user;
      resolvedFromDentistId = true;
      console.log('✅ Resolved dentist ID to user ID:', targetUserId);
    } else {
      // If not a dentist ID, check if it's a direct user ID
      console.log('🔍 Step 2: Not a dentist ID, checking if it\'s a user ID...');
      participantUser = await prisma.user.findUnique({
        where: { id: participantId },
        select: { id: true, name: true, role: true }
      });
      
      if (participantUser) {
        console.log('✅ Found user record directly:', participantUser);
        targetUserId = participantUser.id;
        console.log('✅ Using direct user ID:', targetUserId);
      }
    }

    if (!participantUser) {
      console.error('❌ Neither dentist nor user found for ID:', participantId);
      throw new Error(`No dentist or user found with ID: ${participantId}`);
    }

    console.log('✅ Target user resolved:', {
      originalId: participantId,
      resolvedUserId: targetUserId,
      userName: participantUser.name,
      userRole: participantUser.role,
      wasResolvedFromDentistId: resolvedFromDentistId
    });

    // Find existing conversation using a simpler, more direct approach
    console.log('🔍 Searching for existing conversation...');
    
    // Find conversations where the current user is a participant
    const existingConversations = await prisma.conversation.findMany({
      where: {
        type: 'DIRECT',
        participants: {
          some: {
            userId: currentUserId,
            leftAt: null
          }
        }
      },
      include: {
        participants: {
          where: {
            leftAt: null
          },
          select: {
            userId: true
          }
        }
      }
    });

    console.log('📋 Found conversations for current user:', existingConversations.length);

    // Check if any conversation has exactly the two participants we need
    let conversation: typeof existingConversations[0] | null = null;
    for (const conv of existingConversations) {
      const participantIds = conv.participants.map(p => p.userId);
      console.log(`🔍 Checking conversation ${conv.id} with participants:`, participantIds);
      
      // For self-conversations, check if conversation has only one participant (the user themselves)
      if (currentUserId === targetUserId) {
        if (participantIds.length === 1 && participantIds.includes(currentUserId)) {
          console.log('✅ Found existing self-conversation:', conv.id);
          conversation = conv;
          break;
        }
      } else {
        // For normal conversations, check for exactly two participants
        if (participantIds.length === 2 && 
            participantIds.includes(currentUserId) && 
            participantIds.includes(targetUserId)) {
          console.log('✅ Found existing conversation:', conv.id);
          conversation = conv;
          break;
        }
      }
    }

    if (!conversation) {
      console.log('🆕 No existing conversation found, creating new one...');
      
      // Create new conversation with appropriate participants
      const participantsToCreate = currentUserId === targetUserId 
        ? [{ userId: currentUserId }] // Self-conversation: only one participant
        : [{ userId: currentUserId }, { userId: targetUserId }]; // Normal conversation: two participants
      
      conversation = await prisma.conversation.create({
        data: {
          type: 'DIRECT',
          participants: {
            create: participantsToCreate
          }
        },
        include: {
          participants: {
            where: {
              leftAt: null
            },
            select: {
              userId: true
            }
          }
        }
      });
      
      console.log('✅ New conversation created:', conversation.id);
    }

    // Now fetch the full conversation data with all necessary includes
    console.log('📥 Fetching full conversation data...');
    const fullConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        participants: {
          where: {
            leftAt: null
          },
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

    if (!fullConversation) {
      console.error('❌ Could not fetch full conversation data');
      throw new Error('Could not find or create the conversation details.');
    }

    console.log('✅ Full conversation data fetched successfully:', {
      id: fullConversation.id,
      type: fullConversation.type,
      participantCount: fullConversation.participants.length,
      messageCount: fullConversation.messages.length
    });

    return fullConversation;
  } catch (error: any) {
    console.error('❌ Error in getOrCreateConversation:', error);
    // Be specific about the error message if possible
    throw new Error(`Failed to get or create conversation: ${error.message}`);
  }
}

// Specialized function for creating conversations with dentists
export async function createConversationWithDentist(dentistUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Verify the target user exists (can be dentist or regular user)
    const targetUser = await prisma.user.findUnique({
      where: { id: dentistUserId },
      include: { 
        Dentist: {
          select: { id: true, name: true, verified: true }
        }
      },
    });

    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // Create the conversation
    const conversation = await getOrCreateConversation(dentistUserId);
    
    console.log(`✅ Conversation created between user ${session.user.id} and user ${dentistUserId}`);
    
    return conversation;
  } catch (error: any) {
    console.error('Error creating conversation with user:', error);
    throw new Error(`Failed to create conversation with user: ${error.message}`);
  }
}

// Get user's conversations
export async function getUserConversations() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const conversations = await prisma.conversationParticipant.findMany({
      where: {
        userId: session.user.id,
        leftAt: null,
      },
      include: {
        conversation: {
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
              orderBy: { createdAt: "desc" },
              include: {
                sender: {
                  include: {
                    Dentist: {
                      select: {
                        id: true,
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
                attachments: true,
              },
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: "desc",
        },
      },
    });

    // Transform the data to only include necessary fields and maintain type safety
    return conversations.map((cp) => ({
      ...cp.conversation,
      participants: cp.conversation.participants.map(p => ({
        ...p,
        user: {
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
          image: p.user.image,
          isOnline: p.user.isOnline,
          lastSeen: p.user.lastSeen,
          role: p.user.role,
          Dentist: p.user.Dentist,
        },
      })),
      messages: cp.conversation.messages.map(msg => ({
        ...msg,
        sender: {
          id: msg.sender.id,
          name: msg.sender.name,
          image: msg.sender.image,
          Dentist: msg.sender.Dentist,
        },
      })),
      unreadCount: cp.unreadCount,
      isPinned: cp.isPinned,
      isMuted: cp.isMuted,
      lastReadMessageId: cp.lastReadMessageId,
    }));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
}

// Get messages for a conversation
export async function getConversationMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      throw new Error("Not authorized to view this conversation");
    }

    const skip = (page - 1) * limit;
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      include: {
        sender: {
          include: {
            Dentist: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        receiver: {
          include: {
            Dentist: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        attachments: true,
        replyTo: {
          include: {
            sender: {
              include: {
                Dentist: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Transform the data to ensure type consistency
    const transformedMessages = messages.map(msg => ({
      ...msg,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        email: msg.sender.email,
        image: msg.sender.image,
        Dentist: msg.sender.Dentist,
      },
      receiver: {
        id: msg.receiver.id,
        name: msg.receiver.name,
        email: msg.receiver.email,
        image: msg.receiver.image,
        Dentist: msg.receiver.Dentist,
      },
      replyTo: msg.replyTo ? {
        ...msg.replyTo,
        sender: {
          id: msg.replyTo.sender.id,
          name: msg.replyTo.sender.name,
          image: msg.replyTo.sender.image,
          Dentist: msg.replyTo.sender.Dentist,
        },
      } : undefined,
    }));

    return transformedMessages.reverse(); // Return in chronological order
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}

// Send a message
export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" = "TEXT",
  replyToId?: string,
  attachments?: Array<{
    id?: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
  }>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      throw new Error("Not authorized to send messages in this conversation");
    }

    // Get the other participant (for direct messages)
    const otherParticipant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: { not: session.user.id },
        leftAt: null,
      },
    });

    // For self-conversations, the receiver is the same as the sender
    const receiverId = otherParticipant ? otherParticipant.userId : session.user.id;

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        messageType,
        conversationId,
        senderId: session.user.id,
        receiverId: receiverId,
        replyToId,
        attachments: attachments
          ? {
              create: attachments.map(({ id, ...attachment }) => attachment),
            }
          : undefined,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        attachments: true,
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Update conversation's last message and timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: message.id,
        updatedAt: new Date(),
      },
    });

    // Update unread count for other participants (only if not a self-conversation)
    if (otherParticipant) {
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId,
          userId: { not: session.user.id },
        },
        data: {
          unreadCount: { increment: 1 },
        },
      });
    }

    revalidatePath("/chat");
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  conversationId: string,
  messageIds?: string[]
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Update message status
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        id: messageIds ? { in: messageIds } : undefined,
        status: { not: "READ" },
      },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    // Reset unread count
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: session.user.id,
      },
      data: {
        unreadCount: 0,
      },
    });

    revalidatePath("/chat");
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw new Error("Failed to mark messages as read");
  }
}

// Update user online status
export async function updateUserOnlineStatus(isOnline: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isOnline,
        lastSeen: isOnline ? undefined : new Date(),
      },
    });

    // Also update dentist status if user is a dentist
    const dentist = await prisma.dentist.findFirst({
      where: { userId: session.user.id },
    });

    if (dentist) {
      await prisma.dentist.update({
        where: { id: dentist.id },
        data: {
          isOnline,
          lastSeen: isOnline ? undefined : new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating online status:", error);
  }
}

// Search users (dentists) for starting new conversations
export async function searchUsers(query: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
        // Allow messaging any user, including themselves
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isOnline: true,
        lastSeen: true,
        role: true,
        Dentist: {
          select: {
            id: true,
            speciality: true,
            city: true,
            verified: true,
            rating: true,
          },
        },
      },
      take: 10,
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
}

// Delete message
export async function deleteMessage(messageId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: session.user.id,
      },
    });

    if (!message) {
      throw new Error("Message not found or not authorized");
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        content: "This message was deleted",
      },
    });

    revalidatePath("/chat");
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }
}

// Edit message
export async function editMessage(messageId: string, newContent: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: session.user.id,
      },
    });

    if (!message) {
      throw new Error("Message not found or not authorized");
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent,
        isEdited: true,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        attachments: true,
      },
    });

    revalidatePath("/chat");
    return updatedMessage;
  } catch (error) {
    console.error("Error editing message:", error);
    throw new Error("Failed to edit message");
  }
}

// Get unread message count
export async function getUnreadMessageCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const result = await prisma.conversationParticipant.aggregate({
      where: {
        userId: session.user.id,
        leftAt: null,
      },
      _sum: {
        unreadCount: true,
      },
    });

    return result._sum.unreadCount || 0;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
} 