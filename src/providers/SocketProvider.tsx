'use client';

import { useSession } from 'next-auth/react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  connectionError: string | null;
  reconnecting: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  connectionError: null,
  reconnecting: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const handleUserOnline = useCallback((data: { userId: string }) => {
    setOnlineUsers(prev => new Set(prev).add(data.userId));
  }, []);

  const handleUserOffline = useCallback((data: { userId: string }) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (!session?.user) {
      if (socket) {
        console.log('🔌 Disconnecting socket - no user session');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionError(null);
        setOnlineUsers(new Set());
      }
      return;
    }

    console.log(
      '🔌 Initializing Socket.IO connection for user:',
      session.user.id
    );

    // Get the Socket.IO server URL from environment variable
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        userId: session.user.id,
      },
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    setSocket(newSocket);

    // Connection event handlers
    const onConnect = () => {
      console.log('✅ Socket.IO connected');
      setIsConnected(true);
      setConnectionError(null);
      setReconnecting(false);
    };

    const onDisconnect = (reason: string) => {
      console.log('❌ Socket.IO disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        setConnectionError('Server disconnected');
      }
    };

    const onConnectError = (error: Error) => {
      console.error('❌ Socket.IO connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    };

    const onReconnect = (attemptNumber: number) => {
      console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
      setReconnecting(false);
      setConnectionError(null);
    };

    const onReconnectAttempt = (attemptNumber: number) => {
      console.log(`🔄 Socket.IO reconnection attempt ${attemptNumber}`);
      setReconnecting(true);
      setConnectionError('Reconnecting...');
    };

    const onReconnectError = (error: Error) => {
      console.error('❌ Socket.IO reconnection error:', error.message);
      setConnectionError(`Reconnection failed: ${error.message}`);
    };

    const onReconnectFailed = () => {
      console.error('❌ Socket.IO reconnection failed completely');
      setConnectionError('Unable to reconnect to server');
      setReconnecting(false);
    };

    const onConnectionConfirmed = (data: any) => {
      console.log('✅ Socket.IO connection confirmed:', data);
    };

    // Register event listeners
    newSocket.on('connect', onConnect);
    newSocket.on('disconnect', onDisconnect);
    newSocket.on('connect_error', onConnectError);
    newSocket.on('reconnect', onReconnect);
    newSocket.on('reconnect_attempt', onReconnectAttempt);
    newSocket.on('reconnect_error', onReconnectError);
    newSocket.on('reconnect_failed', onReconnectFailed);
    newSocket.on('connection_confirmed', onConnectionConfirmed);
    newSocket.on('user_online', handleUserOnline);
    newSocket.on('user_offline', handleUserOffline);

    // Test the connection
    newSocket.emit('test_message', {
      message: 'Client connection test',
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    return () => {
      console.log('🔌 Cleaning up Socket.IO connection');
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      newSocket.off('connect_error', onConnectError);
      newSocket.off('reconnect', onReconnect);
      newSocket.off('reconnect_attempt', onReconnectAttempt);
      newSocket.off('reconnect_error', onReconnectError);
      newSocket.off('reconnect_failed', onReconnectFailed);
      newSocket.off('connection_confirmed', onConnectionConfirmed);
      newSocket.off('user_online', handleUserOnline);
      newSocket.off('user_offline', handleUserOffline);
      newSocket.disconnect();
    };
  }, [session, handleUserOnline, handleUserOffline]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        connectionError,
        reconnecting,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
