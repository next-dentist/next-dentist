'use client';

import {
  getOrCreateConversation,
  getUnreadMessageCount,
  getUserConversations,
} from '@/app/actions/chat';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConnectionStatus } from '@/components/chat/ConnectionStatus';
import { ConversationList } from '@/components/chat/ConversationList';
import { NewChatModal } from '@/components/chat/NewChatModal';
import { useSocket } from '@/hooks/useSocket';
import { MessageCircle, Plus, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP' | 'CHANNEL';
  title?: string;
  lastMessageId?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  lastReadMessageId?: string;
  participants: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      isOnline: boolean;
      lastSeen?: string;
      role: 'USER' | 'DENTIST' | 'ADMIN';
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      image?: string;
    };
    attachments: Array<{
      id: string;
      filename: string;
      url: string;
      mimeType: string;
    }>;
  }>;
}

function ChatPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Socket connection with enhanced error handling
  const {
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    joinConversation,
    leaveConversation,
    reconnect,
  } = useSocket();

  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a ref to track processed URL parameters to prevent infinite loops
  const processedParamsRef = useRef<string | null>(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      console.log('👤 User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
  }, [status, router]);

  // Enhanced conversation loading with better error handling
  const loadConversations = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📥 Loading conversations for user:', session.user.id);
      const convs = await getUserConversations();

      // Transform conversations with proper error handling
      const transformedConversations = convs
        .map(conv => {
          try {
            return {
              ...conv,
              title: conv.title || undefined,
              lastMessageId: conv.lastMessageId || undefined,
              createdAt:
                typeof conv.createdAt === 'string'
                  ? conv.createdAt
                  : conv.createdAt.toISOString(),
              updatedAt:
                typeof conv.updatedAt === 'string'
                  ? conv.updatedAt
                  : conv.updatedAt.toISOString(),
              messages: conv.messages.map(msg => ({
                ...msg,
                createdAt:
                  typeof msg.createdAt === 'string'
                    ? msg.createdAt
                    : msg.createdAt.toISOString(),
              })),
              participants: conv.participants.map(p => ({
                id: p.id,
                userId: p.userId,
                user: {
                  id: p.user.id,
                  name: p.user.name || 'Unknown User',
                  email: p.user.email || '',
                  image: p.user.image || undefined,
                  isOnline: p.user.isOnline || false,
                  lastSeen: p.user.lastSeen
                    ? typeof p.user.lastSeen === 'string'
                      ? p.user.lastSeen
                      : p.user.lastSeen.toISOString()
                    : undefined,
                  role: p.user.role as 'USER' | 'DENTIST' | 'ADMIN',
                },
              })),
            } as Conversation;
          } catch (convError) {
            console.error(
              'Error transforming conversation:',
              conv.id,
              convError
            );
            return null;
          }
        })
        .filter(Boolean) as Conversation[];

      setConversations(transformedConversations);
      console.log(`✅ Loaded ${transformedConversations.length} conversations`);
    } catch (error: any) {
      console.error('❌ Error loading conversations:', error);
      setError('Failed to load conversations. Please try again.');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Load unread count with error handling
  const loadUnreadCount = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const count = await getUnreadMessageCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Don't show error toast for this as it's not critical
    }
  }, [session?.user?.id]);

  // Enhanced direct message handling
  const handleDirectMessage = useCallback(
    async (userId: string) => {
      const startTime = new Date().toISOString();
      console.log('🚀 handleDirectMessage STARTED at:', startTime);
      console.log('📋 Input userId:', userId);
      console.log('📊 Current state check:', {
        creatingConversation,
        sessionUserId: session?.user?.id,
        conversationsCount: conversations.length,
        socketConnected: isConnected,
      });

      if (creatingConversation || !session?.user?.id) {
        console.log('❌ Exiting early:', {
          creatingConversation,
          hasSession: !!session?.user?.id,
        });
        return;
      }

      // Set up timeout to reset creating state if it gets stuck
      const timeoutId = setTimeout(() => {
        console.log('⚠️ Conversation creation timeout - resetting state');
        setCreatingConversation(false);
        toast.error('Conversation creation timed out. Please try again.');
      }, 15000); // 15 second timeout

      try {
        setCreatingConversation(true);
        console.log('✅ Set creatingConversation = true');

        // Clean up URL immediately to prevent re-triggers
        console.log('🧹 Cleaning up URL first to prevent re-triggers...');
        const url = new URL(window.location.href);
        url.searchParams.delete('user');
        url.searchParams.delete('dentist');
        url.searchParams.delete('type');
        router.replace(url.pathname, { scroll: false });
        console.log('✅ URL cleaned up immediately');

        console.log('💬 Creating/finding conversation with user:', userId);

        // Check if conversation already exists in current conversations
        console.log('🔍 Checking existing conversations...');
        const existingConversation = conversations.find(
          conv =>
            conv.type === 'DIRECT' &&
            conv.participants.some(p => p.user.id === userId)
        );

        if (existingConversation) {
          console.log(
            '✅ Found existing conversation:',
            existingConversation.id
          );
          setSelectedConversationId(existingConversation.id);
          console.log('✅ Existing conversation selected');
          clearTimeout(timeoutId);
          return;
        }

        // Create new conversation using the fixed server action
        console.log('🆕 No existing conversation found, creating new one...');
        console.log('🆕 Creating new conversation with userId:', userId);
        console.log('🆕 Current user ID:', session.user.id);

        console.log('📞 Calling getOrCreateConversation...');
        const conversation = await getOrCreateConversation(userId);
        console.log('✅ getOrCreateConversation completed successfully!');
        console.log('📋 Conversation result:', {
          id: conversation.id,
          type: conversation.type,
          participantCount: conversation.participants.length,
        });

        // Clear timeout since we succeeded
        clearTimeout(timeoutId);

        // If socket is connected, also create/join the conversation through Socket.IO for real-time functionality
        if (socket && isConnected) {
          console.log(
            '🔌 Socket connected, notifying Socket.IO server about conversation creation'
          );
          socket.emit('create_conversation', {
            targetUserId: userId,
          });

          // Join the conversation room immediately
          socket.emit('join_conversation', conversation.id);
          console.log(
            `📥 Joining conversation room via socket: ${conversation.id}`
          );
        } else {
          console.log('⚠️ Socket not connected, skipping socket notifications');
        }

        console.log('🔄 Transforming conversation data...');
        // Transform the new conversation
        const transformedConversation: Conversation = {
          ...conversation,
          title: conversation.title || undefined,
          lastMessageId: conversation.lastMessageId || undefined,
          createdAt:
            typeof conversation.createdAt === 'string'
              ? conversation.createdAt
              : conversation.createdAt.toISOString(),
          updatedAt:
            typeof conversation.updatedAt === 'string'
              ? conversation.updatedAt
              : conversation.updatedAt.toISOString(),
          messages: conversation.messages.map(msg => ({
            ...msg,
            createdAt:
              typeof msg.createdAt === 'string'
                ? msg.createdAt
                : msg.createdAt.toISOString(),
            sender: {
              id: msg.sender.id,
              name: msg.sender.name || 'Unknown User',
              image: msg.sender.image || undefined,
            },
            attachments: msg.attachments || [],
          })),
          participants: conversation.participants.map(p => ({
            ...p,
            user: {
              id: p.user.id,
              name: p.user.name || 'Unknown User',
              email: p.user.email || '',
              image: p.user.image || undefined,
              isOnline: p.user.isOnline || false,
              lastSeen: p.user.lastSeen
                ? typeof p.user.lastSeen === 'string'
                  ? p.user.lastSeen
                  : p.user.lastSeen.toISOString()
                : undefined,
              role: (p.user.role as 'USER' | 'DENTIST' | 'ADMIN') || 'USER',
            },
          })),
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          lastReadMessageId: undefined,
        };

        console.log('✅ Conversation transformation completed');

        // Add to conversations list
        console.log('📝 Adding conversation to list...');
        setConversations(prev => [transformedConversation, ...prev]);
        setSelectedConversationId(transformedConversation.id);
        console.log(
          '✅ Conversation added and selected:',
          transformedConversation.id
        );

        toast.success('Conversation created successfully');
        console.log('🎉 Success toast shown');
      } catch (error: any) {
        console.error('❌ Error in handleDirectMessage:', error);
        console.error('❌ Error stack:', error.stack);
        toast.error(`Failed to create conversation: ${error.message}`);
        clearTimeout(timeoutId);
      } finally {
        setCreatingConversation(false);
        console.log('✅ Set creatingConversation = false');
        const endTime = new Date().toISOString();
        console.log('🏁 handleDirectMessage COMPLETED at:', endTime);
      }
    },
    [conversations, session?.user?.id, router, socket, isConnected]
  );

  // Load initial data
  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([loadConversations(), loadUnreadCount()]).catch(error => {
        console.error('Error loading initial data:', error);
      });
    }
  }, [session?.user?.id, loadConversations, loadUnreadCount]);

  // Handle URL parameters for direct messages
  useEffect(() => {
    const userId = searchParams?.get('user');
    const dentistId = searchParams?.get('dentist');
    const idType = searchParams?.get('type');
    const currentTime = new Date().toISOString();
    const currentParamsString = searchParams?.toString() || '';

    // Create a unique key for this set of parameters
    const paramsKey = `${userId}_${dentistId}_${idType}`;

    console.log('🔍 URL effect triggered at:', currentTime);
    console.log('📋 Full URL search params:', currentParamsString);
    console.log('🎯 Extracted parameters:', {
      userId,
      dentistId,
      idType,
      currentUserId: session?.user?.id,
      paramsKey,
      lastProcessedKey: processedParamsRef.current,
    });

    // Prevent processing the same parameters multiple times
    if (processedParamsRef.current === paramsKey) {
      console.log(
        '⏭️ Skipping - already processed these parameters:',
        paramsKey
      );
      return;
    }

    // Reset processed key if no user parameter (cleared URL)
    if (!userId) {
      console.log('🧹 No userId parameter - resetting processed key');
      processedParamsRef.current = null;
      return;
    }

    console.log('📊 Current state:', {
      sessionUserId: session?.user?.id,
      sessionStatus: status,
      loading,
      conversationsLength: conversations.length,
      creatingConversation,
      hasHandleDirectMessage: !!handleDirectMessage,
      windowLocation:
        typeof window !== 'undefined' ? window.location.href : 'SSR',
    });

    if (userId && session?.user?.id && !loading && !creatingConversation) {
      console.log('✅ All conditions met! Creating conversation with:', {
        targetId: userId,
        idType: idType || 'unknown',
        dentistId: dentistId || 'not provided',
        currentUserId: session.user.id,
        paramsKey,
      });
      console.log(
        '⏰ About to call handleDirectMessage at:',
        new Date().toISOString()
      );

      // Mark these parameters as processed BEFORE calling handleDirectMessage
      processedParamsRef.current = paramsKey;
      console.log('✅ Marked parameters as processed:', paramsKey);

      // Call handleDirectMessage
      handleDirectMessage(userId);

      console.log('✅ handleDirectMessage called successfully');
    } else {
      console.log('❌ Conditions not met for handleDirectMessage:', {
        hasUserId: !!userId,
        hasSession: !!session?.user?.id,
        sessionStatus: status,
        isNotLoading: !loading,
        isNotCreating: !creatingConversation,
        searchParamsRaw: currentParamsString,
        allSearchParams: searchParams
          ? Object.fromEntries(searchParams.entries())
          : null,
      });

      // Log specific reasons why conditions aren't met
      if (!userId) console.log('❌ Missing userId parameter');
      if (!session?.user?.id) console.log('❌ Missing session or user ID');
      if (loading) console.log('❌ Still loading');
      if (creatingConversation) console.log('❌ Already creating conversation');
    }
  }, [searchParams, session?.user?.id, status, loading, handleDirectMessage]);

  // Connection status monitoring
  useEffect(() => {
    if (connectionError) {
      console.warn('🔌 Socket connection error:', connectionError);
    }

    if (isConnected) {
      console.log('✅ Socket connected - chat features available');
    } else {
      console.log('⚠️ Socket disconnected - limited chat functionality');
    }
  }, [isConnected, connectionError]);

  // Handle conversation selection
  const handleConversationSelect = useCallback(
    (conversationId: string) => {
      console.log('📱 Selecting conversation:', conversationId);
      setSelectedConversationId(conversationId);

      // Reset unread count for selected conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      // Update total unread count
      loadUnreadCount();
    },
    [loadUnreadCount]
  );

  // Handle new conversation creation
  const handleNewConversation = useCallback((conversation: Conversation) => {
    console.log('🆕 Adding new conversation to list:', conversation.id);
    setConversations(prev => [conversation, ...prev]);
    setSelectedConversationId(conversation.id);
    setIsNewChatOpen(false);
  }, []);

  // Handle back navigation on mobile
  const handleBack = useCallback(() => {
    setSelectedConversationId(null);
  }, []);

  // Get selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find(c => c.id === selectedConversationId)
    : null;

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Creating conversation state
  if (creatingConversation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Creating conversation...</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Please wait while we set up your chat
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !conversations.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <MessageCircle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-xl font-semibold">Unable to load chat</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadConversations();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mobile view - show chat interface if conversation selected
  if (isMobile && selectedConversation) {
    return (
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Connection status bar */}
        <div className="border-b">
          <ConnectionStatus />
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatInterface
            conversation={selectedConversation}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  // Desktop view or mobile conversation list
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div
        className={`bg-card flex flex-col border-r ${
          isMobile ? 'w-full' : 'w-80'
        }`}
      >
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-primary h-6 w-6" />
              <h1 className="text-xl font-semibold">Messages</h1>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="hover:bg-muted rounded-full p-2"
              title="Start new chat"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="border-b">
          <ConnectionStatus />
        </div>

        {/* Debug section for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-b bg-yellow-50 p-3">
            <div className="text-xs text-yellow-800">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>User ID: {session?.user?.id}</p>
              <p>Conversations: {conversations.length}</p>
              <p>URL Params: {searchParams?.toString()}</p>
              <p>Target User: {searchParams?.get('user')}</p>
              <p>Dentist ID: {searchParams?.get('dentist')}</p>
              <p>ID Type: {searchParams?.get('type')}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Creating: {creatingConversation ? 'Yes' : 'No'}</p>
              <div className="mt-2">
                <button
                  onClick={() =>
                    window.open('/api/test-chat-creation?action=list', '_blank')
                  }
                  className="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white"
                >
                  List Conversations
                </button>
                <button
                  onClick={() => {
                    const userId = prompt('Enter dentist user ID to test:');
                    if (userId) {
                      window.open(
                        `/api/test-chat-creation?action=create&userId=${userId}`,
                        '_blank'
                      );
                    }
                  }}
                  className="rounded bg-green-500 px-2 py-1 text-xs text-white"
                >
                  Test Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <div className="text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-semibold">
                  No conversations yet
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Start a conversation with a dentist to get help with your
                  dental needs.
                </p>
                <button
                  onClick={() => setIsNewChatOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2 text-sm"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onConversationSelect={handleConversationSelect}
              onlineUsers={onlineUsers}
              loading={false}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area - Desktop Only */}
      {!isMobile && (
        <div className="flex-1 overflow-hidden">
          {selectedConversation ? (
            <ChatInterface conversation={selectedConversation} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageCircle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-semibold">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Choose a conversation from the sidebar to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
}

// Main page component with Suspense wrapper
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
