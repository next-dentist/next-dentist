'use client';
// pages/index.js

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Initialize socket outside component but connect inside useEffect
let socket: Socket | null = null;

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      // Connect to the Socket.IO server using environment variable
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      socket = io(socketUrl);

      socket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
      });

      socket.on('message', (msg: string) => {
        setMessages(prev => [...prev, msg]);
      });
    };

    socketInitializer();

    // Cleanup function
    return () => {
      if (socket) {
        socket.off('message');
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && connected && socket) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message"
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
