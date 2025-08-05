'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Wifi, WifiOff } from 'lucide-react';

interface OfflineMessageBannerProps {
  isConnected: boolean;
  isRecipientOnline: boolean;
  recipientName?: string;
  recipientRole?: 'USER' | 'DENTIST' | 'ADMIN';
  lastSeen?: string;
}

export function OfflineMessageBanner({
  isConnected,
  isRecipientOnline,
  recipientName,
  recipientRole,
  lastSeen,
}: OfflineMessageBannerProps) {
  // No connection at all
  if (!isConnected) {
    return (
      <div className="border-b border-red-200 bg-red-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              No internet connection
            </p>
            <p className="text-xs text-red-700">
              Messages will be delivered when connection is restored
            </p>
          </div>
          <Badge variant="destructive" className="text-xs">
            Offline
          </Badge>
        </div>
      </div>
    );
  }

  // Connected but recipient is offline
  if (!isRecipientOnline && recipientRole === 'DENTIST') {
    return (
      <div className="border-b border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              {recipientName} is currently offline
            </p>
            <p className="text-xs text-blue-700">
              Your messages will be delivered when they come back online
              {lastSeen && ` • Last seen ${lastSeen}`}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            Offline delivery
          </Badge>
        </div>
      </div>
    );
  }

  // Connected and recipient is online
  if (isRecipientOnline) {
    return (
      <div className="border-b border-green-200 bg-green-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-800">
            {recipientName} is online • Messages will be delivered instantly
          </p>
          <Badge variant="default" className="bg-green-600 text-xs">
            <Wifi className="mr-1 h-3 w-3" />
            Online
          </Badge>
        </div>
      </div>
    );
  }

  return null;
}
