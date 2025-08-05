'use client';

import { cn } from '@/lib/utils';
import { Check, CheckCheck, Clock, X } from 'lucide-react';

interface MessageStatusProps {
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
  isOwn?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function MessageStatus({
  status,
  timestamp,
  isOwn = false,
  isOnline = false,
  className,
}: MessageStatusProps) {
  if (!isOwn) return null;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'SENT':
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            {!isOnline && (
              <span className="text-xs text-gray-500">Offline delivery</span>
            )}
          </div>
        );
      case 'DELIVERED':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'FAILED':
        return (
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-red-500" />
            <span className="text-xs text-red-500">Failed</span>
          </div>
        );
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div
      className={cn('flex items-center gap-1 text-xs text-gray-500', className)}
    >
      <span>{formatTime(timestamp)}</span>
      {getStatusIcon()}
    </div>
  );
}
