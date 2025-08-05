'use client';

import { uploadAction } from '@/app/(actions)/media/upload';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from 'emoji-picker-react';
import {
  FileText,
  Loader2,
  Music,
  Paperclip,
  Send,
  Smile,
  Video,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (
    content: string,
    messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO',
    attachments?: any[]
  ) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  replyingTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  } | null;
  onCancelReply?: () => void;
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  replyingTo,
  onCancelReply,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  // Handle typing indicators
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop();
    }, 2000);
  }, [isTyping, onTypingStart, onTypingStop]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    onTypingStop();
  }, [onTypingStop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      setIsUploading(true);

      // Handle file uploads if any
      let uploadedAttachments: any[] = [];
      if (attachments.length > 0) {
        uploadedAttachments = await uploadFiles(attachments);
      }

      // Determine message type
      let messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO' = 'TEXT';
      if (attachments.length > 0) {
        const firstFile = attachments[0];
        if (firstFile.type.startsWith('image/')) {
          messageType = 'IMAGE';
        } else if (firstFile.type.startsWith('video/')) {
          messageType = 'VIDEO';
        } else if (firstFile.type.startsWith('audio/')) {
          messageType = 'VOICE';
        } else {
          messageType = 'FILE';
        }
      }

      onSendMessage(message.trim(), messageType, uploadedAttachments);

      // Clear input
      setMessage('');
      setAttachments([]);
      handleTypingStop();

      // Focus back to input
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<any[]> => {
    const uploadPromises = files.map(async file => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Use the existing uploadAction
        const uploadedMedia = await uploadAction(null, formData);

        // Return in the format expected by the chat system
        return {
          id: uploadedMedia.id,
          filename: uploadedMedia.filename,
          url: uploadedMedia.url,
          mimeType: uploadedMedia.mimeType,
          size: uploadedMedia.size,
          // Add image dimensions if it's an image
          width: file.type.startsWith('image/') ? 800 : undefined,
          height: file.type.startsWith('image/') ? 600 : undefined,
        };
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      // If any upload fails, we still return the successful ones
      const settledPromises = await Promise.allSettled(uploadPromises);
      const successfulUploads = settledPromises
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === 'fulfilled'
        )
        .map(result => result.value);

      if (successfulUploads.length === 0) {
        throw new Error('All file uploads failed');
      }

      return successfulUploads;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const maxSize = 50 * 1024 * 1024; // 50MB limit to match typical FTP limits
    const maxFiles = 5; // Maximum 5 files per message

    // Check total file limit
    if (attachments.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed per message.`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }

      // Check supported file types
      const supportedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/webm',
        'audio/mp3',
        'audio/wav',
        'audio/mpeg',
        'audio/ogg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv',
      ];

      if (!supportedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) selected for upload.`);
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);

      setMessage(newMessage);

      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }

    setIsEmojiPickerOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Paperclip className="text-primary h-5 w-5" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="text-primary h-5 w-5" />;
    } else if (mimeType.startsWith('audio/')) {
      return <Music className="text-primary h-5 w-5" />;
    } else {
      return <FileText className="text-primary h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-3 p-4">
      {/* Reply preview */}
      {replyingTo && (
        <div className="bg-muted/50 border-primary rounded-lg border-l-4 p-3">
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
              size="sm"
              variant="ghost"
              onClick={onCancelReply}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* File attachments preview */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="bg-muted/50 flex items-center gap-3 rounded-lg p-2"
            >
              {file.type.startsWith('image/') ? (
                <div className="h-10 w-10 overflow-hidden rounded">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded">
                  {getFileTypeIcon(file.type)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {formatFileSize(file.size)}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeAttachment(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/avi,video/mov,video/webm,audio/mp3,audio/wav,audio/mpeg,audio/ogg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
          disabled={isUploading}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="max-h-[120px] min-h-[40px] resize-none pr-12"
            disabled={isUploading}
          />

          {/* Emoji picker */}
          <div className="absolute right-2 bottom-2">
            <Popover
              open={isEmojiPickerOpen}
              onOpenChange={setIsEmojiPickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  disabled={isUploading}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end" side="top">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSendMessage}
          disabled={
            (!message.trim() && attachments.length === 0) || isUploading
          }
          size="sm"
          className="shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Character limit indicator */}
      {message.length > 0 && (
        <div className="text-muted-foreground text-right text-xs">
          {message.length}/2000
        </div>
      )}
    </div>
  );
}
