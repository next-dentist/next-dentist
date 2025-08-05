'use client';

import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { MessageBubble } from './MessageBubble';

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onReply: (message: Message) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  isOnline: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  isOnline,
}: MessageListProps) {
  const [editingMessage, setEditingMessage] = useState<string | null>(null);

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  const shouldShowDateSeparator = (
    currentMessage: Message,
    previousMessage?: Message
  ) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.createdAt);
    const previousDate = new Date(previousMessage.createdAt);

    return !isSameDay(currentDate, previousDate);
  };

  const shouldShowAvatar = (currentMessage: Message, nextMessage?: Message) => {
    if (!nextMessage) return true;

    const currentDate = new Date(currentMessage.createdAt);
    const nextDate = new Date(nextMessage.createdAt);
    const timeDiff = nextDate.getTime() - currentDate.getTime();

    // Show avatar if next message is from different sender or more than 5 minutes apart
    return (
      nextMessage.senderId !== currentMessage.senderId ||
      timeDiff > 5 * 60 * 1000
    );
  };

  const shouldShowTimestamp = (
    currentMessage: Message,
    nextMessage?: Message
  ) => {
    if (!nextMessage) return true;

    const currentDate = new Date(currentMessage.createdAt);
    const nextDate = new Date(nextMessage.createdAt);
    const timeDiff = nextDate.getTime() - currentDate.getTime();

    // Show timestamp if next message is from different sender or more than 5 minutes apart
    return (
      nextMessage.senderId !== currentMessage.senderId ||
      timeDiff > 5 * 60 * 1000
    );
  };

  const handleEditStart = (messageId: string) => {
    setEditingMessage(messageId);
  };

  const handleEditSave = (messageId: string, newContent: string) => {
    onEdit(messageId, newContent);
    setEditingMessage(null);
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground mb-2">No messages yet</p>
          <p className="text-muted-foreground text-sm">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : undefined;

        const showDateSeparator = shouldShowDateSeparator(
          message,
          previousMessage
        );
        const showAvatar = shouldShowAvatar(message, nextMessage);
        const showTimestamp = shouldShowTimestamp(message, nextMessage);
        const isOwnMessage = message.senderId === currentUserId;
        const isEditing = editingMessage === message.id;

        return (
          <div key={message.id}>
            {/* Date separator */}
            {showDateSeparator && (
              <div className="my-4 flex items-center justify-center">
                <div className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                  {formatDateSeparator(new Date(message.createdAt))}
                </div>
              </div>
            )}

            {/* Message bubble */}
            <MessageBubble
              message={message}
              isOwnMessage={isOwnMessage}
              showAvatar={showAvatar}
              showTimestamp={showTimestamp}
              isEditing={isEditing}
              onReply={() => onReply(message)}
              onEditStart={() => handleEditStart(message.id)}
              onEditSave={newContent => handleEditSave(message.id, newContent)}
              onEditCancel={handleEditCancel}
              onDelete={() => onDelete(message.id)}
              isOnline={isOnline}
            />
          </div>
        );
      })}
    </div>
  );
}
