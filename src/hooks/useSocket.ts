"use client";

import { getSocketAuthConfig, getSocketConfig } from "@/lib/socket-config";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO" | "SYSTEM";
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  readAt?: string;
  deliveredAt?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  replyToId?: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
  }>;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      image?: string;
    };
  };
}

interface TypingUser {
  userId: string;
  conversationId: string;
}

interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string[]>;
  connectionError: string | null;
  sendMessage: (data: {
    conversationId: string;
    content: string;
    messageType?: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO";
    replyToId?: string;
    tempId?: string;
    attachments?: Array<{
      filename: string;
      url: string;
      mimeType: string;
      size: number;
      width?: number;
      height?: number;
    }>;
  }) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  markMessagesAsRead: (conversationId: string, messageIds?: string[]) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  reconnect: () => void;
  // Event handlers
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageSent: (callback: (data: { tempId: string; message: Message }) => void) => void;
  onMessageEdited: (callback: (message: Message) => void) => void;
  onMessageDeleted: (callback: (data: { messageId: string; conversationId: string }) => void) => void;
  onMessagesRead: (callback: (data: { conversationId: string; readByUserId: string; messageIds?: string[] }) => void) => void;
  onTypingStart: (callback: (data: TypingUser) => void) => void;
  onTypingStop: (callback: (data: TypingUser) => void) => void;
  onUserOnline: (callback: (data: OnlineStatus) => void) => void;
  onUserOffline: (callback: (data: OnlineStatus) => void) => void;
  onMessageNotification: (callback: (data: { conversationId: string; message: Message; unreadCount: number }) => void) => void;
}



export const useSocket = (): UseSocketReturn => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, string[]>>(new Map());
  
  // Use refs to store current values for cleanup
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const connectionAttemptRef = useRef<Promise<Socket> | null>(null);
  const mountedRef = useRef(true);
  
  // Event handlers registry
  const eventHandlers = useRef<{
    onNewMessage?: (message: Message) => void;
    onMessageSent?: (data: { tempId: string; message: Message }) => void;
    onMessageEdited?: (message: Message) => void;
    onMessageDeleted?: (data: { messageId: string; conversationId: string }) => void;
    onMessagesRead?: (data: { conversationId: string; readByUserId: string; messageIds?: string[] }) => void;
    onTypingStart?: (data: TypingUser) => void;
    onTypingStop?: (data: TypingUser) => void;
    onUserOnline?: (data: OnlineStatus) => void;
    onUserOffline?: (data: OnlineStatus) => void;
    onMessageNotification?: (data: { conversationId: string; message: Message; unreadCount: number }) => void;
  }>({});

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    if (socketRef.current) {
      console.log('🧹 Cleaning up socket connection...');
      
      // Remove all event listeners before disconnecting
      socketRef.current.removeAllListeners();
      
      // Disconnect gracefully
      if (socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      
      socketRef.current = null;
    }
    
    // Reset state
    setSocket(null);
    setIsConnected(false);
    setConnectionError(null);
    setOnlineUsers(new Set());
    setTypingUsers(new Map());
    isConnectedRef.current = false;
    connectionAttemptRef.current = null;
  }, []);

  // Enhanced connection creation with production optimizations
  const createConnection = useCallback(async (userId: string, userEmail: string): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      if (!mountedRef.current) {
        reject(new Error('Component unmounted'));
        return;
      }

      const config = getSocketConfig();
      const authConfig = getSocketAuthConfig(userId, userEmail);
      
      console.log(`🔌 Creating socket connection for user: ${userId}`);
      console.log(`🌐 Target URL: ${config.url}`);
      console.log(`🚀 Transport order: ${config.transports.join(' → ')}`);
      
      // Create socket instance with enhanced configuration
      const socketInstance = io(config.url, {
        transports: config.transports,
        ...config.options,
        ...authConfig
      });

      let resolved = false;
      const timeoutMs = config.options.timeout;

      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (!resolved && mountedRef.current) {
          resolved = true;
          console.error(`⏰ Socket connection timeout after ${timeoutMs}ms`);
          socketInstance.removeAllListeners();
          socketInstance.disconnect();
          reject(new Error(`Connection timeout to ${config.url} after ${timeoutMs}ms`));
        }
      }, timeoutMs);

      // Connection successful
      socketInstance.on('connect', () => {
        if (!resolved && mountedRef.current) {
          resolved = true;
          clearTimeout(connectionTimeout);
          
          console.log(`✅ Socket connected successfully!`);
          console.log(`📋 Socket ID: ${socketInstance.id}`);
          console.log(`🌐 Server: ${config.url}`);
          console.log(`🚀 Transport: ${socketInstance.io.engine.transport.name}`);
          
          // Store reference for cleanup
          socketRef.current = socketInstance;
          resolve(socketInstance);
        }
      });

      // Connection failed
      socketInstance.on('connect_error', (error) => {
        if (!resolved && mountedRef.current) {
          resolved = true;
          clearTimeout(connectionTimeout);
          
                     console.error(`❌ Socket connection failed:`, {
             error: error.message,
             url: config.url,
             transport: (error as any).description || 'unknown',
             code: (error as any).type || 'unknown'
           });
          
          // Provide helpful error messages
          let userMessage = 'Connection failed';
          if (error.message.includes('CORS')) {
            userMessage = 'CORS error - server configuration issue';
          } else if (error.message.includes('timeout')) {
            userMessage = 'Connection timeout - server unreachable';
          } else if (error.message.includes('websocket')) {
            userMessage = 'WebSocket failed, trying fallback transport';
          }
          
          reject(new Error(userMessage));
        }
      });

      // Enhanced event logging for production debugging
      socketInstance.on('disconnect', (reason) => {
        console.log(`🔌 Socket disconnected: ${reason}`);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect - don't auto-reconnect
          setConnectionError('Server disconnected');
        }
      });

      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
        setConnectionError(null);
        if (mountedRef.current) {
          toast.success('Reconnected to chat server');
        }
      });

      socketInstance.on('reconnect_error', (error) => {
        console.error('🔄❌ Reconnection failed:', error.message);
      });

      socketInstance.on('error', (error) => {
        console.error('❌ Socket error:', error);
        if (mountedRef.current) {
          setConnectionError(`Socket error: ${error.message || error}`);
        }
      });

      // Transport upgrade logging (production debugging)
      if (socketInstance.io.engine) {
        socketInstance.io.engine.on('upgrade', () => {
          console.log(`🚀 Transport upgraded to: ${socketInstance.io.engine.transport.name}`);
        });

        socketInstance.io.engine.on('upgradeError', (error) => {
          console.warn(`⚠️ Transport upgrade failed: ${error.message}`);
          console.log('💡 Continuing with polling transport');
        });
      }
    });
  }, []);

  // Initialize socket connection with better error handling
  const initializeConnection = useCallback(async () => {
    if (!session?.user?.id || !mountedRef.current) {
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (connectionAttemptRef.current) {
      try {
        return await connectionAttemptRef.current;
      } catch (error) {
        // If previous attempt failed, continue with new attempt
        connectionAttemptRef.current = null;
      }
    }

    // Skip if already connected with same user
    if (socketRef.current?.connected && userIdRef.current === session.user.id) {
      setSocket(socketRef.current);
      setIsConnected(true);
      return;
    }

    try {
      setConnectionError(null);
      console.log(`🔌 Initializing socket for user: ${session.user.name} (${session.user.id})`);
      
      // Clean up any existing connection
      if (socketRef.current) {
        cleanup();
      }

      // Create new connection
      connectionAttemptRef.current = createConnection(session.user.id, session.user.email!);
      const socketInstance = await connectionAttemptRef.current;

      if (!mountedRef.current) {
        socketInstance.disconnect();
        return;
      }

      // Store user reference
      userIdRef.current = session.user.id;

      // Set up event handlers
      setupSocketEventHandlers(socketInstance);

      // Update state
      setSocket(socketInstance);
      setIsConnected(true);
      isConnectedRef.current = true;
      
      console.log('✅ Socket initialization complete');
      
    } catch (error: any) {
      console.error('❌ Socket initialization failed:', error.message);
      
      if (mountedRef.current) {
        setConnectionError(error.message);
        setIsConnected(false);
        
        // Show user-friendly error message
        if (error.message.includes('timeout')) {
          toast.error('Unable to connect to chat server. Please check your internet connection.');
        } else if (error.message.includes('CORS')) {
          toast.error('Chat server configuration error. Please try again later.');
        } else {
          toast.error('Unable to connect to chat. Please try again.');
        }
      }
    } finally {
      connectionAttemptRef.current = null;
    }
  }, [session?.user?.id, session?.user?.email, session?.user?.name, createConnection, cleanup]);

  // Set up socket event handlers
  const setupSocketEventHandlers = useCallback((socketInstance: Socket) => {
    // Connection events
    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket server');
      if (mountedRef.current) {
        setIsConnected(true);
        setConnectionError(null);
        isConnectedRef.current = true;
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`❌ Disconnected: ${reason}`);
      if (mountedRef.current) {
        setIsConnected(false);
        isConnectedRef.current = false;
        
        if (reason !== 'io client disconnect') {
          setConnectionError(`Disconnected: ${reason}`);
        }
      }
    });

    // Server confirmation
    socketInstance.on('connection_confirmed', (data: any) => {
      console.log('✅ Connection confirmed by server:', data);
      if (mountedRef.current && data.userName) {
        toast.success(`Connected as ${data.userName}`);
      }
    });

    // Message events
    socketInstance.on('new_message', (message: Message) => {
      console.log('📨 New message received:', message.id);
      eventHandlers.current.onNewMessage?.(message);
    });

    socketInstance.on('message_sent', (data: { tempId: string; message: Message }) => {
      console.log('✅ Message sent confirmation:', data.tempId);
      eventHandlers.current.onMessageSent?.(data);
    });

    socketInstance.on('message_edited', (message: Message) => {
      console.log('✏️ Message edited:', message.id);
      eventHandlers.current.onMessageEdited?.(message);
    });

    socketInstance.on('message_deleted', (data: { messageId: string; conversationId: string }) => {
      console.log('🗑️ Message deleted:', data.messageId);
      eventHandlers.current.onMessageDeleted?.(data);
    });

    socketInstance.on('messages_read', (data: { conversationId: string; readByUserId: string; messageIds?: string[] }) => {
      console.log('👀 Messages read:', data.conversationId);
      eventHandlers.current.onMessagesRead?.(data);
    });

    // Typing events
    socketInstance.on('user_typing', (data: TypingUser & { isTyping: boolean }) => {
      if (data.isTyping) {
        eventHandlers.current.onTypingStart?.(data);
      } else {
        eventHandlers.current.onTypingStop?.(data);
      }
    });

    // Presence events
    socketInstance.on('user_online', (data: OnlineStatus) => {
      console.log(`🟢 User online: ${data.userId}`);
      if (mountedRef.current) {
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      }
      eventHandlers.current.onUserOnline?.(data);
    });

    socketInstance.on('user_offline', (data: OnlineStatus) => {
      console.log(`🔴 User offline: ${data.userId}`);
      if (mountedRef.current) {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
      eventHandlers.current.onUserOffline?.(data);
    });

    // Notification events
    socketInstance.on('message_notification', (data: { conversationId: string; message: Message; unreadCount: number }) => {
      console.log('🔔 Message notification:', data.conversationId);
      eventHandlers.current.onMessageNotification?.(data);
    });

    // Error handling
    socketInstance.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
      if (mountedRef.current) {
        setConnectionError(`Error: ${error.message || error}`);
      }
    });

    // Development testing
    if (process.env.NODE_ENV === 'development') {
      socketInstance.on('test_response', (data: any) => {
        console.log('🧪 Test response:', data);
        toast.success(`Socket test successful: ${data.serverStatus || 'OK'}`);
      });
    }
  }, []);

  // Initialize connection when user changes
  useEffect(() => {
    if (session?.user?.id) {
      initializeConnection();
    } else {
      cleanup();
    }
  }, [session?.user?.id, initializeConnection, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Socket action methods with enhanced error handling
  const sendMessage = useCallback((data: {
    conversationId: string;
    content: string;
    messageType?: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO";
    replyToId?: string;
    tempId?: string;
    attachments?: Array<{
      filename: string;
      url: string;
      mimeType: string;
      size: number;
      width?: number;
      height?: number;
    }>;
  }) => {
    if (socketRef.current?.connected) {
      console.log('📤 Sending message via socket:', data.tempId || 'new');
      socketRef.current.emit('send_message', data);
    } else {
      console.warn('⚠️ Cannot send message: socket not connected');
      if (mountedRef.current) {
        toast.error('Cannot send message: not connected to chat server');
      }
    }
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      console.log('🏠 Joining conversation:', conversationId);
      socketRef.current.emit('join_conversation', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      console.log('🚪 Leaving conversation:', conversationId);
      socketRef.current.emit('leave_conversation', conversationId);
    }
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing_start', conversationId);
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing_stop', conversationId);
    }
  }, []);

  const markMessagesAsRead = useCallback((conversationId: string, messageIds?: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_messages_read', { conversationId, messageIds });
    }
  }, []);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('edit_message', { messageId, newContent });
    }
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('delete_message', messageId);
    }
  }, []);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnection triggered');
    setConnectionError(null);
    initializeConnection();
  }, [initializeConnection]);

  // Event handler setters
  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    eventHandlers.current.onNewMessage = callback;
  }, []);

  const onMessageSent = useCallback((callback: (data: { tempId: string; message: Message }) => void) => {
    eventHandlers.current.onMessageSent = callback;
  }, []);

  const onMessageEdited = useCallback((callback: (message: Message) => void) => {
    eventHandlers.current.onMessageEdited = callback;
  }, []);

  const onMessageDeleted = useCallback((callback: (data: { messageId: string; conversationId: string }) => void) => {
    eventHandlers.current.onMessageDeleted = callback;
  }, []);

  const onMessagesRead = useCallback((callback: (data: { conversationId: string; readByUserId: string; messageIds?: string[] }) => void) => {
    eventHandlers.current.onMessagesRead = callback;
  }, []);

  const onTypingStart = useCallback((callback: (data: TypingUser) => void) => {
    eventHandlers.current.onTypingStart = callback;
  }, []);

  const onTypingStop = useCallback((callback: (data: TypingUser) => void) => {
    eventHandlers.current.onTypingStop = callback;
  }, []);

  const onUserOnline = useCallback((callback: (data: OnlineStatus) => void) => {
    eventHandlers.current.onUserOnline = callback;
  }, []);

  const onUserOffline = useCallback((callback: (data: OnlineStatus) => void) => {
    eventHandlers.current.onUserOffline = callback;
  }, []);

  const onMessageNotification = useCallback((callback: (data: { conversationId: string; message: Message; unreadCount: number }) => void) => {
    eventHandlers.current.onMessageNotification = callback;
  }, []);

  return {
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
    reconnect,
    onNewMessage,
    onMessageSent,
    onMessageEdited,
    onMessageDeleted,
    onMessagesRead,
    onTypingStart,
    onTypingStop,
    onUserOnline,
    onUserOffline,
    onMessageNotification,
  };
}; 