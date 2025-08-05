'use client';

import { ConnectionStatus } from '@/components/chat/ConnectionStatus';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export default function TestSocketPage() {
  const { data: session } = useSession();
  const {
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    reconnect,
    onNewMessage,
    onMessageSent,
  } = useSocket();

  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('Hello from test page!');
  const [testConversationId, setTestConversationId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [directSocket, setDirectSocket] = useState<Socket | null>(null);
  const [directConnected, setDirectConnected] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
    console.log(`[Socket Test] ${message}`);
  };

  // Create a direct socket connection for testing (bypass authentication)
  const createDirectConnection = () => {
    addLog('🔧 Creating direct socket connection for testing...');

    // Get the Socket.IO server URL from environment variable
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    const testSocket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      auth: {
        userId: session?.user?.id || `test-${Date.now()}`,
        userEmail: session?.user?.email || 'test@example.com',
      },
      query: {
        userId: session?.user?.id || `test-${Date.now()}`,
        userEmail: session?.user?.email || 'test@example.com',
      },
      forceNew: true,
    });

    testSocket.on('connect', () => {
      addLog('✅ Direct socket connected! ID: ' + testSocket.id);
      setDirectConnected(true);
    });

    testSocket.on('disconnect', reason => {
      addLog(`❌ Direct socket disconnected: ${reason}`);
      setDirectConnected(false);
    });

    testSocket.on('connect_error', error => {
      addLog(`❌ Direct socket connection error: ${error.message}`);
      console.error('Direct socket error details:', error);
    });

    testSocket.on('connection_confirmed', data => {
      addLog(`✅ Direct connection confirmed: ${JSON.stringify(data)}`);
    });

    testSocket.on('test_response', data => {
      addLog(`🧪 Direct test response: ${JSON.stringify(data)}`);
    });

    testSocket.on('error', error => {
      addLog(`❌ Direct socket error: ${error.message || error}`);
      console.error('Direct socket runtime error:', error);
    });

    // Add debug events
    testSocket.on('reconnect', attemptNumber => {
      addLog(`🔄 Direct socket reconnected after ${attemptNumber} attempts`);
    });

    testSocket.on('reconnect_attempt', attemptNumber => {
      addLog(`🔄 Direct socket reconnect attempt ${attemptNumber}`);
    });

    testSocket.on('reconnect_error', error => {
      addLog(`❌ Direct socket reconnect error: ${error.message}`);
    });

    testSocket.on('reconnect_failed', () => {
      addLog(`❌ Direct socket reconnect failed`);
    });

    setDirectSocket(testSocket);
  };

  const disconnectDirect = () => {
    if (directSocket) {
      directSocket.disconnect();
      setDirectSocket(null);
      setDirectConnected(false);
      addLog('🔌 Direct socket disconnected');
    }
  };

  const testDirectSocket = () => {
    if (directSocket && directConnected) {
      addLog('🧪 Sending test message via direct socket...');
      directSocket.emit('test_message', {
        message: testMessage,
        timestamp: new Date().toISOString(),
        from: 'direct-test',
      });
    } else {
      addLog('❌ Direct socket not connected');
    }
  };

  // Setup event listeners for main socket
  useEffect(() => {
    if (!socket) {
      addLog('⚠️ Main socket not available');
      return;
    }

    addLog('🔧 Setting up main socket listeners...');

    const handleConnect = () => addLog('✅ Main socket connected');
    const handleDisconnect = (reason: string) =>
      addLog(`❌ Main socket disconnected: ${reason}`);
    const handleError = (error: any) =>
      addLog(`❌ Main socket error: ${error.message || error}`);
    const handleTestResponse = (data: any) => {
      addLog(`🧪 Main test response: ${JSON.stringify(data)}`);
      toast.success('Socket test successful!');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);
    socket.on('error', handleError);
    socket.on('test_response', handleTestResponse);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      socket.off('error', handleError);
      socket.off('test_response', handleTestResponse);
    };
  }, [socket]);

  // Setup message listeners
  useEffect(() => {
    onNewMessage(message => {
      addLog(`📨 New message: ${message.content}`);
      setMessages(prev => [...prev, message]);
    });

    onMessageSent(data => {
      addLog(`✅ Message sent: ${data.message.content}`);
    });
  }, [onNewMessage, onMessageSent]);

  const testSocketConnection = () => {
    if (socket && isConnected) {
      addLog('🧪 Sending test message via main socket...');
      socket.emit('test_message', {
        message: testMessage,
        timestamp: new Date().toISOString(),
        from: 'test-page',
      });
    } else {
      addLog('❌ Cannot test - main socket not connected');
    }
  };

  const testJoinConversation = () => {
    if (testConversationId.trim()) {
      addLog(`📥 Joining conversation: ${testConversationId}`);
      joinConversation(testConversationId);
    } else {
      addLog('❌ Please enter a conversation ID');
    }
  };

  const testLeaveConversation = () => {
    if (testConversationId.trim()) {
      addLog(`📤 Leaving conversation: ${testConversationId}`);
      leaveConversation(testConversationId);
    } else {
      addLog('❌ Please enter a conversation ID');
    }
  };

  const testSendMessage = () => {
    if (testConversationId.trim() && testMessage.trim()) {
      addLog(`📤 Sending message to conversation: ${testConversationId}`);
      sendMessage({
        conversationId: testConversationId,
        content: testMessage,
        tempId: `test-${Date.now()}`,
      });
    } else {
      addLog('❌ Please enter conversation ID and message');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setMessages([]);
  };

  const handleReconnect = () => {
    addLog('🔄 Manual reconnect initiated...');
    reconnect();
  };

  // Add initial log when component mounts
  useEffect(() => {
    addLog('🚀 Test socket page loaded');
    addLog(`Session status: ${session ? 'Logged in' : 'Not logged in'}`);
    if (session?.user) {
      addLog(`User: ${session.user.name} (${session.user.id})`);
    }
  }, [session]);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">🔌 Socket.IO Test Page</h1>

      {/* Connection Status */}
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Connection Status</h2>
        <ConnectionStatus />
      </div>

      {/* User Info */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-3 text-xl font-semibold">User Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Name:</strong> {session?.user?.name || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {session?.user?.email || 'N/A'}
          </div>
          <div>
            <strong>User ID:</strong> {session?.user?.id || 'N/A'}
          </div>
          <div>
            <strong>Socket ID:</strong> {socket?.id || 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Test Controls */}
        <div className="space-y-6">
          {/* Direct Socket Testing */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="mb-4 text-xl font-semibold">
              Direct Socket Testing
            </h2>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={createDirectConnection}
                  disabled={directConnected}
                  className="flex-1 rounded bg-red-500 p-2 text-white hover:bg-red-600 disabled:bg-gray-300"
                >
                  🔧 Create Direct Connection
                </button>
                <button
                  onClick={disconnectDirect}
                  disabled={!directConnected}
                  className="flex-1 rounded bg-gray-500 p-2 text-white hover:bg-gray-600 disabled:bg-gray-300"
                >
                  🔌 Disconnect
                </button>
              </div>
              <button
                onClick={testDirectSocket}
                disabled={!directConnected}
                className="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 disabled:bg-gray-300"
              >
                🧪 Test Direct Socket
              </button>
              <div className="text-sm">
                <strong>Direct Status:</strong>{' '}
                <span
                  className={
                    directConnected ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {directConnected ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-4 text-xl font-semibold">
              Main Socket Test Controls
            </h2>

            <div className="space-y-4">
              {/* Basic Connection Test */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Test Message:
                </label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={e => setTestMessage(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2"
                  placeholder="Enter test message"
                />
                <button
                  onClick={testSocketConnection}
                  disabled={!isConnected}
                  className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
                >
                  🧪 Test Main Socket Connection
                </button>
              </div>

              {/* Conversation Tests */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Conversation ID:
                </label>
                <input
                  type="text"
                  value={testConversationId}
                  onChange={e => setTestConversationId(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2"
                  placeholder="Enter conversation ID"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={testJoinConversation}
                    disabled={!isConnected}
                    className="rounded bg-green-500 p-2 text-sm text-white hover:bg-green-600 disabled:bg-gray-300"
                  >
                    📥 Join
                  </button>
                  <button
                    onClick={testLeaveConversation}
                    disabled={!isConnected}
                    className="rounded bg-orange-500 p-2 text-sm text-white hover:bg-orange-600 disabled:bg-gray-300"
                  >
                    📤 Leave
                  </button>
                </div>
                <button
                  onClick={testSendMessage}
                  disabled={!isConnected}
                  className="w-full rounded bg-purple-500 p-2 text-white hover:bg-purple-600 disabled:bg-gray-300"
                >
                  📨 Send Test Message
                </button>
              </div>

              {/* Connection Management */}
              <div className="space-y-2">
                <button
                  onClick={handleReconnect}
                  className="w-full rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                >
                  🔄 Force Reconnect
                </button>
                <button
                  onClick={clearLogs}
                  className="w-full rounded bg-gray-500 p-2 text-white hover:bg-gray-600"
                >
                  🧹 Clear Logs
                </button>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-4 text-xl font-semibold">Status Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Main Connected:</span>
                <span
                  className={isConnected ? 'text-green-600' : 'text-red-600'}
                >
                  {isConnected ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Direct Connected:</span>
                <span
                  className={
                    directConnected ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {directConnected ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Error:</span>
                <span
                  className={
                    connectionError ? 'text-red-600' : 'text-green-600'
                  }
                >
                  {connectionError || '✅ None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Online Users:</span>
                <span>{onlineUsers.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Messages Received:</span>
                <span>{messages.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="h-96 overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold text-white">Event Logs</h2>
            <span className="text-gray-400">{logs.length} events</span>
          </div>
          {logs.length === 0 ? (
            <div className="text-gray-500">No events yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-xl font-semibold">Received Messages</h2>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className="rounded border-l-4 border-blue-500 bg-gray-50 p-3"
              >
                <div className="font-medium">
                  {message.sender?.name || 'Unknown'}
                </div>
                <div className="text-gray-600">{message.content}</div>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
