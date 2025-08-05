'use client';

import {
  getConversationMessages,
  sendMessage as sendMessageAction,
} from '@/app/actions/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowDown,
  ArrowLeft,
  Info,
  MoreVertical,
  Phone,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { OfflineMessageBanner } from './OfflineMessageBanner';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
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

interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP' | 'CHANNEL';
  title?: string;
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
}

interface ChatInterfaceProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessagesAsRead: socketMarkAsRead,
    editMessage,
    deleteMessage,
    onNewMessage,
    onMessageSent,
    onMessageEdited,
    onMessageDeleted,
    onMessagesRead,
  } = useSocket();

  const otherParticipant = conversation.participants.find(
    p => p.user.id !== session?.user?.id
  )?.user;

  const isOnline = otherParticipant
    ? onlineUsers.has(otherParticipant.id)
    : false;
  const typingUserIds = typingUsers.get(conversation.id) || [];
  const isOtherUserTyping = typingUserIds.some(id => id !== session?.user?.id);

  // Check if user is near bottom of chat
  const checkScrollPosition = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollTop >= scrollHeight - clientHeight - 100;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition]);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  // Join conversation on mount
  useEffect(() => {
    if (conversation.id && socket && isConnected) {
      console.log('Joining conversation:', conversation.id);
      joinConversation(conversation.id);
      return () => {
        console.log('Leaving conversation:', conversation.id);
        leaveConversation(conversation.id);
      };
    }
  }, [
    conversation.id,
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
  ]);

  // Socket event handlers
  useEffect(() => {
    // Handle new messages from socket
    onNewMessage(message => {
      console.log('Received new message:', message);
      if (message.conversationId === conversation.id) {
        // Skip if this is our own message (handled by onMessageSent instead)
        if (message.senderId === session?.user?.id) {
          console.log(
            'Skipping own message - will be handled by message_sent event'
          );
          return;
        }

        // Check if message already exists (to avoid duplicates)
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) {
            console.log('Message already exists, skipping duplicate');
            return prev; // Don't add duplicate
          }
          console.log('Adding new message to UI');
          return [...prev, message];
        });

        // Mark as read if conversation is active
        if (document.hasFocus()) {
          socketMarkAsRead(conversation.id, [message.id]);
        }
        // Removed auto-scroll on new message - let user control scrolling
      }
    });

    onMessageEdited(message => {
      if (message.conversationId === conversation.id) {
        setMessages(prev => prev.map(m => (m.id === message.id ? message : m)));
      }
    });

    onMessageDeleted(data => {
      if (data.conversationId === conversation.id) {
        setMessages(prev =>
          prev.map(m =>
            m.id === data.messageId
              ? { ...m, isDeleted: true, content: 'This message was deleted' }
              : m
          )
        );
      }
    });

    onMessagesRead(data => {
      if (data.conversationId === conversation.id) {
        setMessages(prev =>
          prev.map(m =>
            data.messageIds?.includes(m.id) || !data.messageIds
              ? {
                  ...m,
                  status: 'READ' as const,
                  readAt: new Date().toISOString(),
                }
              : m
          )
        );
      }
    });

    onMessageSent(data => {
      if (data.message.conversationId === conversation.id) {
        // Replace temp message with real message
        setMessages(prev =>
          prev.map(msg => (msg.id === data.tempId ? data.message : msg))
        );
        // Only scroll to bottom for own messages
        setTimeout(() => scrollToBottom(), 100);
      }
    });
  }, [
    conversation.id,
    session?.user?.id,
    socketMarkAsRead,
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onMessagesRead,
    onMessageSent,
  ]);

  // Mark messages as read when conversation becomes active
  useEffect(() => {
    const handleFocus = () => {
      const unreadMessages = messages
        .filter(m => m.receiverId === session?.user?.id && m.status !== 'READ')
        .map(m => m.id);

      if (unreadMessages.length > 0) {
        socketMarkAsRead(conversation.id, unreadMessages);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [messages, conversation.id, session?.user?.id, socketMarkAsRead]);

  const loadMessages = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const newMessages = await getConversationMessages(
        conversation.id,
        pageNum,
        50
      );

      // Transform messages to ensure proper typing
      const transformedMessages = newMessages.map(msg => ({
        ...msg,
        createdAt:
          typeof msg.createdAt === 'string'
            ? msg.createdAt
            : msg.createdAt.toISOString(),
        readAt: msg.readAt
          ? typeof msg.readAt === 'string'
            ? msg.readAt
            : msg.readAt.toISOString()
          : undefined,
        deliveredAt: msg.deliveredAt
          ? typeof msg.deliveredAt === 'string'
            ? msg.deliveredAt
            : msg.deliveredAt.toISOString()
          : undefined,
        sender: {
          ...msg.sender,
          name: msg.sender.name || '',
          email: msg.sender.email || '',
          image: msg.sender.image || undefined,
        },
        receiver: {
          ...msg.receiver,
          name: msg.receiver.name || '',
          email: msg.receiver.email || '',
          image: msg.receiver.image || undefined,
        },
      })) as Message[];

      if (pageNum === 1) {
        setMessages(transformedMessages);
        setTimeout(scrollToBottom, 100);
      } else {
        setMessages(prev => [...transformedMessages, ...prev]);
      }

      setHasMore(newMessages.length === 50);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMessages(page + 1);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced offline messaging functionality
  const handleSendMessage = useCallback(
    async (
      content: string,
      messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO' = 'TEXT',
      attachments?: any[]
    ) => {
      if (!content.trim() && !attachments?.length) return;

      const tempId = `temp_${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        content: content.trim(),
        messageType,
        status: 'SENT',
        isEdited: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        conversationId: conversation.id,
        senderId: session?.user?.id || '',
        receiverId: otherParticipant?.id || '',
        replyToId: replyingTo?.id,
        sender: {
          id: session?.user?.id || '',
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          image: session?.user?.image || undefined,
        },
        receiver: {
          id: otherParticipant?.id || '',
          name: otherParticipant?.name || '',
          email: otherParticipant?.email || '',
          image: otherParticipant?.image || undefined,
        },
        attachments: attachments || [],
      };

      // Add message optimistically to UI
      setMessages(prev => [...prev, tempMessage]);
      setReplyingTo(null);
      scrollToBottom();

      try {
        let sentMessage: Message;

        if (isConnected) {
          // If connected to socket, use Socket.IO for real-time delivery
          console.log('Sending message via Socket.IO...');
          sendMessage({
            conversationId: conversation.id,
            content: content.trim(),
            messageType,
            replyToId: replyingTo?.id,
            attachments,
            tempId, // Pass tempId for correlation
          });

          // The socket will handle message creation and broadcasting
          // Don't call server action to avoid duplicates
        } else {
          // If not connected to socket, use server action as fallback
          console.log('Sending message via server action (not connected)...');
          const rawMessage = await sendMessageAction(
            conversation.id,
            content.trim(),
            messageType,
            replyingTo?.id,
            attachments
          );

          // Transform to ensure proper typing
          sentMessage = {
            ...rawMessage,
            createdAt:
              typeof rawMessage.createdAt === 'string'
                ? rawMessage.createdAt
                : rawMessage.createdAt.toISOString(),
            readAt: rawMessage.readAt
              ? typeof rawMessage.readAt === 'string'
                ? rawMessage.readAt
                : rawMessage.readAt.toISOString()
              : undefined,
            deliveredAt: rawMessage.deliveredAt
              ? typeof rawMessage.deliveredAt === 'string'
                ? rawMessage.deliveredAt
                : rawMessage.deliveredAt.toISOString()
              : undefined,
            sender: {
              ...rawMessage.sender,
              name: rawMessage.sender.name || '',
              email: rawMessage.sender.email || '',
              image: rawMessage.sender.image || undefined,
            },
            receiver: {
              ...rawMessage.receiver,
              name: rawMessage.receiver.name || '',
              email: rawMessage.receiver.email || '',
              image: rawMessage.receiver.image || undefined,
            },
          } as Message;

          // Replace temp message with real message
          setMessages(prev =>
            prev.map(msg => (msg.id === tempId ? sentMessage : msg))
          );

          // Show notification for server action delivery
          toast.success(
            `Message sent. ${otherParticipant?.name} will receive it when they're online.`,
            { duration: 3000 }
          );
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        // Mark temp message as failed
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempId ? { ...msg, status: 'FAILED' as const } : msg
          )
        );
        toast.error('Failed to send message. Please try again.');
      }
    },
    [
      conversation.id,
      sendMessage,
      replyingTo,
      session?.user,
      otherParticipant,
      isConnected,
    ]
  );

  const handleTypingStart = useCallback(() => {
    if (isConnected) {
      startTyping(conversation.id);
    }
  }, [conversation.id, startTyping, isConnected]);

  const handleTypingStop = useCallback(() => {
    if (isConnected) {
      stopTyping(conversation.id);
    }
  }, [conversation.id, stopTyping, isConnected]);

  const handleEditMessage = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };

  const getConversationTitle = () => {
    if (conversation.title) return conversation.title;
    return otherParticipant?.name || 'Unknown User';
  };

  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (otherParticipant?.lastSeen) {
      return `Last seen ${formatDistanceToNow(new Date(otherParticipant.lastSeen), { addSuffix: true })}`;
    }
    return 'Offline';
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card flex items-center justify-between border-b p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipant?.image || undefined} />
              <AvatarFallback>
                {getConversationTitle()
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} `}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold">
                {getConversationTitle()}
              </h2>
              {otherParticipant?.role === 'DENTIST' && (
                <Badge variant="secondary" className="text-xs">
                  Dentist
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {isOtherUserTyping ? 'Typing...' : getStatusText()}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Offline Message Banner */}
      <OfflineMessageBanner
        isConnected={isConnected}
        isRecipientOnline={isOnline}
        recipientName={otherParticipant?.name}
        recipientRole={otherParticipant?.role}
        lastSeen={
          otherParticipant?.lastSeen
            ? formatDistanceToNow(new Date(otherParticipant.lastSeen), {
                addSuffix: true,
              })
            : undefined
        }
      />

      {/* Reply preview */}
      {replyingTo && (
        <div className="bg-muted/50 border-b px-3 py-2 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                Replying to {replyingTo.sender.name}
              </p>
              <p className="text-muted-foreground truncate text-sm">
                {replyingTo.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="ml-2"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="chat-messages relative min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4"
      >
        {hasMore && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load more messages'}
            </Button>
          </div>
        )}

        <MessageList
          messages={messages}
          currentUserId={session?.user?.id || ''}
          onReply={setReplyingTo}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          isOnline={isOnline}
        />

        {/* Typing indicator */}
        {isOtherUserTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <div className="absolute right-4 bottom-4 z-10">
            <Button
              onClick={scrollToBottom}
              size="sm"
              className="rounded-full shadow-lg transition-shadow hover:shadow-xl"
              variant="secondary"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="bg-card border-t">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </div>
  );
}
