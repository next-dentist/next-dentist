import { NextRequest, NextResponse } from 'next/server';

/**
 * Socket.IO Server Information API Route
 * 
 * This route provides information about the Socket.IO server running on port 3001.
 * Since we've separated Socket.IO from Next.js, this route serves as a bridge
 * to provide connection information and server status.
 */

// GET /api/socket - Get Socket.IO server information
export async function GET(request: NextRequest) {
  try {
    // Get Socket.IO server configuration
    const socketConfig = {
      serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      port: process.env.SOCKET_PORT || '3001',
      environment: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      status: 'separated', // Indicates Socket.IO runs on separate server
      version: '4.8.1',
      transports: ['websocket', 'polling'],
      features: [
        'Real-time messaging',
        'User presence tracking',
        'Typing indicators',
        'Message delivery status',
        'Room-based conversations',
        'Automatic reconnection'
      ]
    };

    // Test Socket.IO server connectivity
    let serverStatus = 'unknown';
    let serverInfo: {
      sid: string;
      upgrades: string[];
      pingInterval: number;
      pingTimeout: number;
    } | null = null;
    
    try {
      const socketServerUrl = socketConfig.serverUrl.replace(/\/$/, '');
      const response = await fetch(`${socketServerUrl}/socket.io/?EIO=4&transport=polling`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const responseText = await response.text();
        // Parse Socket.IO handshake response
        if (responseText.startsWith('0{')) {
          const handshakeData = JSON.parse(responseText.substring(1));
          serverStatus = 'online';
          serverInfo = {
            sid: handshakeData.sid ? 'available' : 'unavailable',
            upgrades: handshakeData.upgrades || [],
            pingInterval: handshakeData.pingInterval || 25000,
            pingTimeout: handshakeData.pingTimeout || 60000,
          };
        }
      } else {
        serverStatus = 'offline';
      }
    } catch (error) {
      console.warn('Socket.IO server connectivity check failed:', error);
      serverStatus = 'unreachable';
    }

    // Connection instructions
    const connectionGuide = {
      clientSetup: {
        install: 'npm install socket.io-client',
        import: "import { io } from 'socket.io-client';",
        connect: `const socket = io('${socketConfig.serverUrl}', {
  auth: {
    userId: 'your-user-id',
    userEmail: 'your-email@example.com'
  }
});`,
      },
      events: {
        connection: 'socket.on("connect", () => console.log("Connected"));',
        message: 'socket.on("new_message", (message) => console.log(message));',
        typing: 'socket.on("user_typing", (data) => console.log(data));',
        presence: 'socket.on("user_online", (data) => console.log(data));',
      },
      actions: {
        sendMessage: `socket.emit('send_message', {
  conversationId: 'conversation_id',
  content: 'Hello!',
  messageType: 'TEXT'
});`,
        joinRoom: "socket.emit('join_conversation', 'conversation_id');",
        typing: "socket.emit('typing_start', 'conversation_id');",
      }
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      server: {
        ...socketConfig,
        status: serverStatus,
        info: serverInfo,
      },
      connection: connectionGuide,
      message: 'Socket.IO server is running separately on port 3001',
      note: 'This API provides Socket.IO server status and connection information'
    });

  } catch (error) {
    console.error('Socket.IO API route error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to get Socket.IO server information',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST /api/socket - Test Socket.IO server connection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'test_connection':
        // Test Socket.IO server connectivity
        const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
        
        try {
          const response = await fetch(`${socketServerUrl}/socket.io/?EIO=4&transport=polling`, {
            method: 'GET',
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const responseText = await response.text();
            return NextResponse.json({
              success: true,
              status: 'online',
              message: 'Socket.IO server is reachable',
              response: responseText.substring(0, 100) + '...',
              timestamp: new Date().toISOString()
            });
          } else {
            return NextResponse.json({
              success: false,
              status: 'error',
              message: `Socket.IO server returned ${response.status}`,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            status: 'offline',
            message: 'Socket.IO server is unreachable',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
        }

      case 'get_server_info':
        return NextResponse.json({
          success: true,
          serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
          port: process.env.SOCKET_PORT || '3001',
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: test_connection, get_server_info' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Socket.IO API POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process Socket.IO request',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// OPTIONS /api/socket - CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
