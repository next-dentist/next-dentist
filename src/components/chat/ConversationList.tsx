'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, Pin, VolumeX } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
      Dentist?: Array<{
        id: string;
        name: string;
        image?: string;
        speciality?: string;
        verified?: boolean;
      }>;
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
      Dentist?: Array<{
        id: string;
        name: string;
        image?: string;
      }>;
    };
    attachments: Array<{
      id: string;
      filename: string;
      url: string;
      mimeType: string;
    }>;
  }>;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onlineUsers: Set<string>;
  loading: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onlineUsers,
  loading,
}: ConversationListProps) {
  const { data: session } = useSession();

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.user.id !== session?.user?.id)
      ?.user;
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title;
    const otherUser = getOtherParticipant(conversation);

    // If user is a dentist, use dentist name, otherwise use user name
    if (otherUser?.Dentist && otherUser.Dentist.length > 0) {
      return otherUser.Dentist[0].name || otherUser.name || 'Unknown User';
    }

    return otherUser?.name || 'Unknown User';
  };

  const getUserImage = (user: any) => {
    // Prioritize dentist image if user is a dentist
    if (user?.Dentist && user.Dentist.length > 0 && user.Dentist[0].image) {
      return user.Dentist[0].image;
    }
    // Fallback to user image
    return user?.image;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages[0];
    if (!lastMessage) return 'No messages yet';

    const isOwnMessage = lastMessage.sender.id === session?.user?.id;
    let content = lastMessage.content;

    // Handle attachments
    if (lastMessage.attachments.length > 0) {
      const attachment = lastMessage.attachments[0];
      if (attachment.mimeType.startsWith('image/')) {
        content = '📷 Photo';
      } else if (attachment.mimeType.startsWith('video/')) {
        content = '🎥 Video';
      } else if (attachment.mimeType.startsWith('audio/')) {
        content = '🎵 Voice message';
      } else {
        content = `📎 ${attachment.filename}`;
      }
    }

    // Truncate long messages
    if (content.length > 50) {
      content = content.substring(0, 50) + '...';
    }

    return isOwnMessage ? `You: ${content}` : content;
  };

  const getMessageStatus = (conversation: Conversation) => {
    const lastMessage = conversation.messages[0];
    if (!lastMessage || lastMessage.sender.id !== session?.user?.id) {
      return null;
    }

    // This would come from the message status in a real implementation
    return <CheckCheck className="h-3 w-3 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-2 flex items-center gap-3 p-3">
            <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
            <div className="flex-1">
              <div className="bg-muted mb-2 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        <p>No conversations yet.</p>
        <p className="mt-1 text-sm">Start a new chat to begin messaging.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map(conversation => {
        const otherUser = getOtherParticipant(conversation);
        const isSelected = conversation.id === selectedConversationId;
        const isOnline = otherUser ? onlineUsers.has(otherUser.id) : false;
        const lastMessage = conversation.messages[0];
        const userImage = getUserImage(otherUser);
        const isDentist =
          otherUser?.role === 'DENTIST' &&
          otherUser?.Dentist &&
          otherUser.Dentist.length > 0;

        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            className={`hover:bg-accent/50 flex cursor-pointer items-center gap-3 p-4 transition-colors ${isSelected ? 'bg-accent' : ''} `}
          >
            {/* Avatar with online indicator */}
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={userImage}
                  alt={getConversationTitle(conversation)}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                  {getConversationTitle(conversation)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <div
                className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} `}
              />
            </div>

            {/* Conversation info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">
                    {getConversationTitle(conversation)}
                  </h3>
                  {/* Role badge for dentists */}
                  {isDentist && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-xs text-blue-800"
                    >
                      {otherUser?.Dentist?.[0]?.verified
                        ? '✓ Verified Dentist'
                        : 'Dentist'}
                    </Badge>
                  )}
                  {/* Pinned indicator */}
                  {conversation.isPinned && (
                    <Pin className="text-muted-foreground h-3 w-3" />
                  )}
                  {/* Muted indicator */}
                  {conversation.isMuted && (
                    <VolumeX className="text-muted-foreground h-3 w-3" />
                  )}
                </div>
                {/* Timestamp */}
                {lastMessage && (
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), {
                      addSuffix: false,
                    })}
                  </span>
                )}
              </div>

              {/* Speciality for dentists */}
              {isDentist && otherUser?.Dentist?.[0]?.speciality && (
                <p className="mb-1 text-xs text-blue-600">
                  {otherUser.Dentist[0].speciality}
                </p>
              )}

              <div className="flex items-center justify-between">
                {/* Last message preview */}
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  {getMessageStatus(conversation)}
                  <span
                    className={`truncate text-sm ${
                      conversation.unreadCount > 0
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {getLastMessagePreview(conversation)}
                  </span>
                </div>

                {/* Unread count badge */}
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant="default"
                    className="bg-primary ml-2 h-5 min-w-[1.25rem] text-xs"
                  >
                    {conversation.unreadCount > 99
                      ? '99+'
                      : conversation.unreadCount}
                  </Badge>
                )}
              </div>

              {/* Online status text */}
              {!isOnline && otherUser?.lastSeen && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Last seen{' '}
                  {formatDistanceToNow(new Date(otherUser.lastSeen), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
