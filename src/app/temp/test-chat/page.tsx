'use client';

import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestChatPage() {
  const { data: session } = useSession();
  const { socket, isConnected, connectionError } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[TestChat] ${message}`);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/test-chat/get-users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        addLog(`📋 Loaded ${data.users.length} users`);
      } else {
        addLog(`❌ Failed to load users: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Error loading users: ${error}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for socket events
    socket.on('conversation_created', data => {
      addLog(`✅ Conversation created: ${data.conversation.id}`);
      setConversationId(data.conversation.id);
    });

    socket.on('new_message', message => {
      addLog(`📨 New message received: ${message.content}`);
      setMessages(prev => [...prev, message]);
    });

    socket.on('message_sent', data => {
      addLog(`✅ Message sent: ${data.message.id}`);
    });

    socket.on('error', error => {
      addLog(`❌ Socket error: ${JSON.stringify(error)}`);
    });

    return () => {
      socket.off('conversation_created');
      socket.off('new_message');
      socket.off('message_sent');
      socket.off('error');
    };
  }, [socket]);

  const createConversation = () => {
    if (!socket || !targetUserId) {
      addLog('❌ Socket not connected or no target user ID');
      return;
    }

    addLog(`🔧 Creating conversation with user: ${targetUserId}`);
    socket.emit('create_conversation', { targetUserId });
  };

  const sendMessage = () => {
    if (!socket || !messageText.trim()) {
      addLog('❌ Socket not connected or no message text');
      return;
    }

    const messageData = {
      content: messageText,
      messageType: 'TEXT',
      ...(conversationId ? { conversationId } : { targetUserId }),
    };

    addLog(`📤 Sending message: ${JSON.stringify(messageData)}`);
    socket.emit('send_message', messageData);
    setMessageText('');
  };

  const sendDirectMessage = () => {
    if (!socket || !messageText.trim() || !targetUserId) {
      addLog('❌ Socket not connected, no message text, or no target user');
      return;
    }

    const messageData = {
      content: messageText,
      messageType: 'TEXT',
      targetUserId,
    };

    addLog(`📤 Sending direct message: ${JSON.stringify(messageData)}`);
    socket.emit('send_message', messageData);
    setMessageText('');
  };

  if (!session) {
    return <div className="p-8">Please log in to test chat</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Chat System Test</h1>

      {/* Connection Status */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Connection Status</h2>
        <div
          className={`inline-block rounded px-3 py-1 ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
        {connectionError && (
          <div className="mt-2 text-red-600">{connectionError}</div>
        )}
        <div className="mt-2 text-sm">
          <strong>Current User:</strong> {session.user?.name} (
          {session.user?.id})
        </div>
      </div>

      {/* Available Users */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Available Users</h2>
        {loadingUsers ? (
          <div className="text-gray-500">Loading users...</div>
        ) : (
          <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
            {users
              .filter(user => user.id !== session.user?.id)
              .map(user => (
                <div
                  key={user.id}
                  className={`cursor-pointer rounded border p-2 hover:bg-gray-50 ${targetUserId === user.id ? 'border-blue-500 bg-blue-100' : ''}`}
                  onClick={() => setTargetUserId(user.id)}
                >
                  <div className="font-medium">
                    {user.name || 'Unnamed User'}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></span>
                    {user.isOnline ? ' Online' : ' Offline'}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Conversation Setup */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Conversation Setup</h2>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Target User ID"
            value={targetUserId}
            onChange={e => setTargetUserId(e.target.value)}
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            onClick={createConversation}
            disabled={!isConnected}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Create Conversation
          </button>
        </div>
        {targetUserId && (
          <div className="text-sm text-blue-600">
            <strong>Selected User:</strong>{' '}
            {users.find(u => u.id === targetUserId)?.name || targetUserId}
          </div>
        )}
        {conversationId && (
          <div className="text-sm text-green-600">
            <strong>Active Conversation:</strong> {conversationId}
          </div>
        )}
      </div>

      {/* Message Sending */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Send Message</h2>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Message text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 rounded border px-3 py-2"
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected}
            className="rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Send (via conversation)
          </button>
          <button
            onClick={sendDirectMessage}
            disabled={!isConnected}
            className="rounded bg-purple-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Send (direct)
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Messages</h2>
        <div className="max-h-60 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-gray-500">No messages yet</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-2 rounded bg-gray-50 p-2">
                <div className="text-sm text-gray-600">
                  {msg.sender?.name || msg.senderId} →{' '}
                  {msg.receiver?.name || msg.receiverId}
                </div>
                <div>{msg.content}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debug Logs */}
      <div className="rounded border p-4">
        <h2 className="mb-2 text-lg font-semibold">Debug Logs</h2>
        <div className="max-h-60 overflow-y-auto rounded bg-black p-2 font-mono text-sm text-green-400">
          {logs.length === 0 ? (
            <div>No logs yet...</div>
          ) : (
            logs.map((log, idx) => <div key={idx}>{log}</div>)
          )}
        </div>
        <button
          onClick={() => setLogs([])}
          className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}
