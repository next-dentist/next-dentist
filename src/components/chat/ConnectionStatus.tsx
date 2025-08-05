import { useSocket } from '@/hooks/useSocket';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Send,
  WifiOff,
} from 'lucide-react';

export const ConnectionStatus = () => {
  const { isConnected, socket, onlineUsers, connectionError, reconnect } =
    useSocket();

  const testSocketMessage = () => {
    if (socket && isConnected) {
      console.log('Testing socket message...');
      socket.emit('test_message', {
        message: 'Test from client',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleReconnect = () => {
    console.log('Manual reconnect triggered by user');
    reconnect();
  };

  const getStatusInfo = () => {
    if (!socket) {
      return {
        status: 'initializing',
        message: 'Initializing connection...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    }

    if (connectionError) {
      return {
        status: 'error',
        message: `Connection error: ${connectionError}`,
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }

    if (isConnected) {
      return {
        status: 'connected',
        message: `Connected to chat server (${onlineUsers.size} users online)`,
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    }

    return {
      status: 'disconnected',
      message: 'Connecting to chat server...',
      icon: <WifiOff className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`rounded-lg border px-3 py-2 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
    >
      <div className={`flex items-center gap-2 text-sm ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="flex-1">{statusInfo.message}</span>

        {/* Socket ID for debugging */}
        {socket && (
          <span className="text-xs opacity-70">
            (ID: {socket.id?.slice(0, 8) || 'pending'})
          </span>
        )}

        {/* Reconnect button for errors */}
        {connectionError && (
          <button
            onClick={handleReconnect}
            className="ml-2 flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
            title="Reconnect to chat server"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}

        {/* Test button for development */}
        {process.env.NODE_ENV === 'development' && isConnected && (
          <button
            onClick={testSocketMessage}
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            title="Test Socket Connection"
          >
            <Send className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-1 text-xs opacity-60">
          <div>
            Socket: {socket ? 'initialized' : 'null'} | Connected:{' '}
            {isConnected ? 'yes' : 'no'} | Error: {connectionError || 'none'}
          </div>
          <div>
            Online Users: {Array.from(onlineUsers).join(', ') || 'none'}
          </div>
        </div>
      )}
    </div>
  );
};
