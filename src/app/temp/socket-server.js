/**
 * Dedicated Socket.IO Server for Real-time Chat
 * 
 * This server handles:
 * - Real-time chat messaging
 * - User presence tracking (online/offline)
 * - Typing indicators
 * - Message delivery status
 * - Database integration with Prisma
 */

require('dotenv').config();

const { createServer } = require('http');
const { Server: SocketIOServer } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const socketPort = parseInt(process.env.SOCKET_PORT || '3001', 10);
const isDev = process.env.NODE_ENV !== 'production';

console.log('🔌 Starting Socket.IO Server...');
console.log(`Environment: ${isDev ? 'development' : 'production'}`);
console.log(`Socket.IO Port: ${socketPort}`);
console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);

// Initialize Prisma
let prisma;
try {
  prisma = new PrismaClient();
  console.log('✅ Prisma client initialized for Socket.IO server');
} catch (error) {
  console.error('❌ Failed to initialize Prisma:', error.message);
  process.exit(1);
}

// In-memory store for connected users
const connectedUsers = new Map(); // userId -> Set<socketId>
const userSockets = new Map(); // socketId -> userId

// Cleanup function for disconnected sockets
const cleanupUserConnection = (socketId, userId) => {
  if (userId) {
    const userSocketIds = connectedUsers.get(userId);
    if (userSocketIds) {
      userSocketIds.delete(socketId);
      if (userSocketIds.size === 0) {
        connectedUsers.delete(userId);
      }
    }
  }
  userSockets.delete(socketId);
};

// Create HTTP server for Socket.IO
const httpServer = createServer();

// Configure allowed origins based on environment
const getAllowedOrigins = () => {
  const origins = [];
  
  if (isDev) {
    origins.push(
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://localhost:3000'
    );
  } else {
    origins.push(
      'https://nextdentist.com',
      'https://www.nextdentist.com'
    );
  }
  
  // Add configured CORS origin
  if (process.env.CORS_ORIGIN) {
    origins.push(process.env.CORS_ORIGIN);
  }
  
  // Add configured site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    origins.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  
  return [...new Set(origins)]; // Remove duplicates
};

// Configure Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
  maxHttpBufferSize: 1e6, // 1MB
});

console.log('✅ Socket.IO server configured with CORS origins:', getAllowedOrigins());

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
      console.error('❌ Socket Auth Error: No userId provided');
      return next(new Error('unauthorized: missing userId'));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      console.error(`❌ Socket Auth Error: User not found for id: ${userId}`);
      return next(new Error('unauthorized: user not found'));
    }

    socket.userId = userId;
    socket.userName = user.name || 'Unknown User';
    socket.userEmail = user.email;
    
    console.log(`🔐 Socket authenticated: ${socket.userName} (${userId})`);
    next();
  } catch (error) {
    console.error('❌ Socket authentication error:', error);
    return next(new Error('authentication failed'));
  }
});

// Connection handling
io.on('connection', async (socket) => {
  const userId = socket.userId;
  const socketId = socket.id;
  
  console.log(`🔌 User connected: ${socket.userName} (${userId}) with socket ${socketId}`);

  try {
    // Track this connection
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socketId);
    userSockets.set(socketId, userId);

    // Check if this is the first connection for this user
    const isFirstConnection = connectedUsers.get(userId).size === 1;

    if (isFirstConnection) {
      try {
        // Update user online status
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: true, lastSeen: new Date() },
        });

        // Update dentist status if applicable
        const dentist = await prisma.dentist.findFirst({
          where: { userId },
        });

        if (dentist) {
          await prisma.dentist.update({
            where: { id: dentist.id },
            data: { isOnline: true, lastSeen: new Date() },
          });
        }

        // Broadcast online status
        socket.broadcast.emit('user_online', {
          userId,
          isOnline: true,
        });
        console.log(`📡 Broadcasted online status for user: ${userId}`);
      } catch (dbError) {
        console.warn('⚠️ Could not update database status:', dbError.message);
      }
    }

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Join all conversation rooms
    try {
      const conversations = await prisma.conversationParticipant.findMany({
        where: { userId, leftAt: null },
        select: { conversationId: true },
      });

      for (const conv of conversations) {
        socket.join(`conversation:${conv.conversationId}`);
      }

      console.log(`📍 User ${userId} joined ${conversations.length} conversation rooms`);
    } catch (dbError) {
      console.warn('⚠️ Could not load conversations:', dbError.message);
    }

    // Send connection confirmation
    socket.emit('connection_confirmed', {
      userId,
      userName: socket.userName,
      socketId,
      isFirstConnection,
    });

    // Test message handler
    socket.on('test_message', (data) => {
      console.log('🧪 Test message from client:', data);
      socket.emit('test_response', {
        message: 'Socket.IO server is working!',
        originalMessage: data,
        timestamp: new Date().toISOString(),
        socketId,
        userId,
      });
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
      console.log(`📥 User ${userId} joined conversation ${conversationId}`);
      socket.emit('conversation_joined', { conversationId });
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
      console.log(`📤 User ${userId} left conversation ${conversationId}`);
      socket.emit('conversation_left', { conversationId });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      console.log(`📨 Received send_message from ${userId}:`, data);
      
      try {
        const { conversationId, content, messageType, replyToId, attachments, tempId } = data;

        if (!conversationId || !content?.trim()) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Verify user is participant
        const participant = await prisma.conversationParticipant.findFirst({
          where: { conversationId, userId, leftAt: null },
        });

        if (!participant) {
          socket.emit('error', { message: 'Not authorized to send messages in this conversation' });
          return;
        }

        // Get the other participant
        const otherParticipant = await prisma.conversationParticipant.findFirst({
          where: { conversationId, userId: { not: userId }, leftAt: null },
        });

        if (!otherParticipant) {
          socket.emit('error', { message: 'Conversation participant not found' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content: content.trim(),
            messageType: messageType || 'TEXT',
            conversationId,
            senderId: userId,
            receiverId: otherParticipant.userId,
            replyToId,
            attachments: attachments ? { create: attachments } : undefined,
          },
          include: {
            sender: { select: { id: true, name: true, email: true, image: true } },
            receiver: { select: { id: true, name: true, email: true, image: true } },
            attachments: true,
            replyTo: {
              include: {
                sender: { select: { id: true, name: true, image: true } },
              },
            },
          },
        });

        // Update conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { lastMessageId: message.id, updatedAt: new Date() },
        });

        // Update unread count for recipient
        await prisma.conversationParticipant.updateMany({
          where: { conversationId, userId: { not: userId } },
          data: { unreadCount: { increment: 1 } },
        });

        // Broadcast message to conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', message);
        
        // Send delivery confirmation to sender
        socket.emit('message_sent', { tempId, message });

        // Check if recipient is online for delivery status
        const isRecipientOnline = connectedUsers.has(otherParticipant.userId);
        if (isRecipientOnline) {
          await prisma.message.update({
            where: { id: message.id },
            data: { status: 'DELIVERED', deliveredAt: new Date() },
          });

          io.to(`conversation:${conversationId}`).emit('message_delivered', {
            messageId: message.id,
            conversationId,
          });
        }

        console.log(`📨 Message sent from ${userId} to ${otherParticipant.userId}`);
      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing_start', (conversationId) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (conversationId) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping: false,
      });
    });

    // Handle disconnection
    socket.on('disconnect', async (reason) => {
      console.log(`🔌 User disconnected: ${socket.userName} (${userId}). Reason: ${reason}`);

      try {
        cleanupUserConnection(socketId, userId);

        const remainingConnections = connectedUsers.get(userId)?.size || 0;
        const isLastConnection = remainingConnections === 0;

        if (isLastConnection) {
          try {
            // Update user offline status
            await prisma.user.update({
              where: { id: userId },
              data: { isOnline: false, lastSeen: new Date() },
            });

            // Update dentist status if applicable
            const dentist = await prisma.dentist.findFirst({
              where: { userId },
            });

            if (dentist) {
              await prisma.dentist.update({
                where: { id: dentist.id },
                data: { isOnline: false, lastSeen: new Date() },
              });
            }

            // Broadcast offline status
            socket.broadcast.emit('user_offline', {
              userId,
              isOnline: false,
              lastSeen: new Date(),
            });

            console.log(`🔴 User ${userId} is now offline`);
          } catch (dbError) {
            console.warn('⚠️ Could not update offline status:', dbError.message);
          }
        }
      } catch (error) {
        console.error('❌ Error handling disconnect:', error);
      }
    });

  } catch (error) {
    console.error('❌ Error in socket connection handler:', error);
    socket.emit('error', { message: 'Connection setup failed' });
  }
});

// Start Socket.IO server
httpServer
  .once('error', (err) => {
    console.error('❌ Socket.IO Server Error:', err);
    process.exit(1);
  })
  .listen(socketPort, () => {
    console.log(`✅ Socket.IO Server ready at http://localhost:${socketPort}`);
    console.log(`📊 Active connections: ${connectedUsers.size} users`);
  });

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Socket.IO Server received ${signal}. Shutting down gracefully...`);
  if (prisma) await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); 