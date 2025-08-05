'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  AlertCircle,
  Check,
  CheckCheck,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Reply,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MessageStatus } from './MessageStatus';

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
  senderId: string;
  receiverId: string;
  replyToId?: string;
  sender: {
    id: string;
    name: string;
    email: string;
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
      Dentist?: Array<{
        id: string;
        name: string;
        image?: string;
      }>;
    };
  };
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
  isEditing: boolean;
  onReply: () => void;
  onEditStart: () => void;
  onEditSave: (newContent: string) => void;
  onEditCancel: () => void;
  onDelete: () => void;
  isOnline: boolean;
}

export function MessageBubble({
  message,
  isOwnMessage,
  showAvatar,
  showTimestamp,
  isEditing,
  onReply,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  isOnline,
}: MessageBubbleProps) {
  const [editContent, setEditContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const getSenderImage = (sender: any) => {
    // Prioritize dentist image if sender is a dentist
    if (
      sender?.Dentist &&
      sender.Dentist.length > 0 &&
      sender.Dentist[0].image
    ) {
      return sender.Dentist[0].image;
    }
    // Fallback to user image
    return sender?.image;
  };

  const getSenderName = (sender: any) => {
    // Prioritize dentist name if sender is a dentist
    if (
      sender?.Dentist &&
      sender.Dentist.length > 0 &&
      sender.Dentist[0].name
    ) {
      return sender.Dentist[0].name;
    }
    // Fallback to user name
    return sender?.name || 'Unknown User';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleEditSave = () => {
    if (editContent.trim() !== message.content && editContent.trim()) {
      onEditSave(editContent.trim());
    } else {
      onEditCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      onEditCancel();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'SENT':
        return <Check className="h-3 w-3" />;
      case 'DELIVERED':
        return <CheckCheck className="h-3 w-3" />;
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'FAILED':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const renderAttachment = (attachment: Message['attachments'][0]) => {
    const isImage = attachment.mimeType.startsWith('image/');
    const isVideo = attachment.mimeType.startsWith('video/');
    const isAudio = attachment.mimeType.startsWith('audio/');

    if (isImage) {
      return (
        <div className="group relative">
          <img
            src={attachment.url}
            alt={attachment.filename}
            className="max-h-64 max-w-sm cursor-pointer rounded-lg transition-opacity hover:opacity-90"
            onClick={() => window.open(attachment.url, '_blank')}
            onError={e => {
              toast.error('Failed to load image');
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0"
              onClick={e => {
                e.stopPropagation();
                window.open(attachment.url, '_blank');
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="max-w-sm">
          <video
            src={attachment.url}
            controls
            className="max-h-64 w-full rounded-lg"
          />
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="max-w-sm">
          <audio src={attachment.url} controls className="w-full" />
        </div>
      );
    }

    // Generic file
    return (
      <div
        className="bg-muted/50 hover:bg-muted flex max-w-sm cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
        onClick={() => window.open(attachment.url, '_blank')}
      >
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Download className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{attachment.filename}</p>
          <p className="text-muted-foreground text-sm">
            {formatFileSize(attachment.size)}
          </p>
        </div>
      </div>
    );
  };

  const senderImage = getSenderImage(message.sender);
  const senderName = getSenderName(message.sender);
  const replyToSenderName = message.replyTo
    ? getSenderName(message.replyTo.sender)
    : '';

  return (
    <div
      className={`flex gap-3 ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } ${showTimestamp ? 'mb-4' : 'mb-1'}`}
    >
      {/* Avatar for received messages */}
      {!isOwnMessage && (
        <div
          className={`${showAvatar ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={senderImage}
              alt={senderName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
              {senderName
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || '?'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Message content */}
      <div
        className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md lg:max-w-lg`}
      >
        {/* Reply reference */}
        {message.replyTo && (
          <div className="bg-muted/50 mb-1 max-w-full rounded-lg px-3 py-2 text-sm">
            <p className="text-muted-foreground text-xs font-medium">
              Replying to {replyToSenderName}
            </p>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}

        {/* Message bubble */}
        <div className="group relative">
          <div
            className={`relative max-w-full rounded-2xl px-4 py-2 break-words ${
              isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
            } ${message.isDeleted ? 'italic opacity-70' : ''} `}
          >
            {/* Message content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-background min-h-[60px] resize-none"
                  placeholder="Edit message..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEditSave}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={onEditCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.isEdited && !message.isDeleted && (
                  <span className="ml-2 text-xs opacity-70">(edited)</span>
                )}
              </>
            )}

            {/* Attachments */}
            {message.attachments.length > 0 && !isEditing && (
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <div key={attachment.id}>{renderAttachment(attachment)}</div>
                ))}
              </div>
            )}

            {/* Message actions */}
            {!isEditing && (
              <div
                className={`absolute top-1 opacity-0 transition-opacity group-hover:opacity-100 ${isOwnMessage ? '-left-10' : '-right-10'} `}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-background h-6 w-6 border p-0 shadow-sm"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'}>
                    <DropdownMenuItem onClick={onReply}>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </DropdownMenuItem>
                    {isOwnMessage && !message.isDeleted && (
                      <>
                        <DropdownMenuItem onClick={onEditStart}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={onDelete}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Timestamp and status */}
          {showTimestamp && (
            <div
              className={`text-muted-foreground mt-1 flex items-center gap-1 text-xs ${isOwnMessage ? 'justify-end' : 'justify-start'} `}
            >
              <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
              {isOwnMessage && (
                <span className="flex items-center">{getStatusIcon()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for sent messages to maintain alignment */}
      {isOwnMessage && (
        <div className={`w-8 ${showAvatar ? 'opacity-0' : ''}`} />
      )}

      <MessageStatus
        status={message.status}
        timestamp={message.createdAt}
        isOwn={isOwnMessage}
        isOnline={isOnline}
      />
    </div>
  );
}
