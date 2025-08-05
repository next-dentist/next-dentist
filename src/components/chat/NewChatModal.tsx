'use client';

import { getOrCreateConversation, searchUsers } from '@/app/actions/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/hooks/useSocket';
import { Loader2, MapPin, MessageCircle, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: 'USER' | 'DENTIST' | 'ADMIN';
  Dentist?: Array<{
    id: string;
    speciality?: string;
    city?: string;
    verified: boolean;
    rating?: number;
  }>;
}

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

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

export function NewChatModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewChatModalProps) {
  const { socket, isConnected } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Clear state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
      setIsSearching(false);
      setIsCreating(false);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await searchUsers(searchQuery.trim());
      // Transform the results to match our User interface
      const transformedResults = results.map(user => ({
        ...user,
        lastSeen: user.lastSeen?.toISOString(),
      }));
      setSearchResults(transformedResults as User[]);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartConversation = async (user: User) => {
    try {
      setIsCreating(true);
      setSelectedUser(user);

      // First create/get the conversation via API
      const conversation = await getOrCreateConversation(user.id);

      // Transform the conversation to match our interface
      const transformedConversation = {
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
        })),
        participants: conversation.participants.map(p => ({
          id: p.id,
          userId: p.userId,
          user: {
            id: p.user.id,
            name: p.user.name || '',
            email: p.user.email || '',
            image: p.user.image || undefined,
            isOnline: p.user.isOnline,
            lastSeen: p.user.lastSeen
              ? typeof p.user.lastSeen === 'string'
                ? p.user.lastSeen
                : p.user.lastSeen.toISOString()
              : undefined,
            role: p.user.role as 'USER' | 'DENTIST' | 'ADMIN',
          },
        })),
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        lastReadMessageId: undefined,
      } as Conversation;

      // If socket is connected, also create the conversation through socket for real-time room joining
      if (socket && isConnected) {
        socket.emit('create_conversation', {
          targetUserId: user.id,
        });

        // Join the conversation room immediately
        socket.emit('join_conversation', transformedConversation.id);
        console.log(
          `📥 Manually joining conversation room: ${transformedConversation.id}`
        );
      }

      onConversationCreated(transformedConversation);
      toast.success(`Started conversation with ${user.name}`);
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    } finally {
      setIsCreating(false);
      setSelectedUser(null);
    }
  };

  const formatRating = (rating?: number) => {
    if (!rating) return 'No rating';
    return `${rating.toFixed(1)} ⭐`;
  };

  const getDentistInfo = (user: User) => {
    return user.Dentist?.[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search dentists by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Search results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground ml-2">Searching...</span>
              </div>
            )}

            {!isSearching &&
              searchQuery.length > 0 &&
              searchResults.length === 0 && (
                <div className="text-muted-foreground py-8 text-center">
                  <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>No dentists found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}

            {!isSearching && searchQuery.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <Search className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Search for dentists</p>
                <p className="text-sm">
                  Enter a name or email to find dentists
                </p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map(user => {
                  const dentistInfo = getDentistInfo(user);
                  const isCreatingThis =
                    isCreating && selectedUser?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
                    >
                      {/* Avatar with online status */}
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>
                            {user.name
                              ?.split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online indicator */}
                        <div
                          className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'} `}
                        />
                      </div>

                      {/* User info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="truncate font-medium">{user.name}</h3>
                          {dentistInfo?.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Speciality and location */}
                        {dentistInfo && (
                          <div className="space-y-1">
                            {dentistInfo.speciality && (
                              <p className="text-muted-foreground text-sm">
                                {dentistInfo.speciality}
                              </p>
                            )}
                            <div className="text-muted-foreground flex items-center gap-4 text-xs">
                              {dentistInfo.city && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {dentistInfo.city}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {formatRating(dentistInfo.rating)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Online status */}
                        <p className="text-muted-foreground mt-1 text-xs">
                          {user.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>

                      {/* Action button */}
                      <Button
                        onClick={() => handleStartConversation(user)}
                        disabled={isCreating}
                        size="sm"
                        className="min-w-[80px]"
                      >
                        {isCreatingThis ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="mr-1 h-3 w-3" />
                            Chat
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Help text */}
          <div className="text-muted-foreground border-t pt-4 text-center text-xs">
            You can only start conversations with verified dentists.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
