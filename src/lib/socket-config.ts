/**
 * Socket.IO Configuration Helper
 * 
 * This module ensures proper socket URL resolution across different environments
 * and provides production-ready configuration for Next.js 15 builds.
 */

interface SocketConfig {
  url: string;
  isProduction: boolean;
  isSecure: boolean;
  transports: string[];
  options: {
    timeout: number;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    reconnectionDelayMax: number;
    randomizationFactor: number;
    upgrade: boolean;
    rememberUpgrade: boolean;
    forceNew: boolean;
    autoConnect: boolean;
    secure: boolean;
    rejectUnauthorized: boolean;
    upgradeTimeout?: number;
    closeOnBeforeunload?: boolean;
    pingTimeout?: number;
    pingInterval?: number;
  };
}

/**
 * Get socket configuration based on environment
 */
export function getSocketConfig(): SocketConfig {
  // Determine environment and socket URL
  const isClientSide = typeof window !== 'undefined';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Socket URL resolution with fallback chain
  let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  
  // Fallback logic for different environments
  if (!socketUrl) {
    if (isClientSide) {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        socketUrl = 'http://localhost:3001';
      } else if (hostname.includes('nextdentist.com')) {
        socketUrl = 'https://socket.nextdentist.com';
      } else {
        // Default production fallback
        socketUrl = 'https://socket.nextdentist.com';
      }
    } else {
      // Server-side fallback
      socketUrl = isDevelopment 
        ? 'http://localhost:3001' 
        : 'https://socket.nextdentist.com';
    }
  }
  
  const isProduction = !socketUrl.includes('localhost') && !socketUrl.includes('127.0.0.1');
  const isSecure = socketUrl.startsWith('https://') || socketUrl.startsWith('wss://');
  
  // Log configuration for debugging
  console.log('🔧 Socket Configuration:', {
    url: socketUrl,
    isProduction,
    isSecure,
    environment: process.env.NODE_ENV,
    hostname: isClientSide ? window.location.hostname : 'server-side',
    userAgent: isClientSide ? navigator.userAgent.substring(0, 50) : 'server'
  });
  
  return {
    url: socketUrl,
    isProduction,
    isSecure,
    // Transport configuration optimized for production reliability
    transports: isProduction 
      ? ['polling', 'websocket']  // Start with polling for production stability
      : ['websocket', 'polling'], // Prefer websocket in development
    options: {
      // Basic connection settings
      timeout: isProduction ? 30000 : 20000,
      reconnection: true,
      reconnectionAttempts: isProduction ? 10 : 5,
      reconnectionDelay: isProduction ? 2000 : 1000,
      reconnectionDelayMax: isProduction ? 10000 : 5000,
      randomizationFactor: 0.5,
      
      // Transport and upgrade settings
      upgrade: true,
      rememberUpgrade: isProduction, // Remember successful upgrade in production
      forceNew: false,
      autoConnect: true,
      
      // Security settings
      secure: isSecure,
      rejectUnauthorized: isProduction,
      
      // Production-specific optimizations
      ...(isProduction && {
        upgradeTimeout: 60000, // Extended timeout for WebSocket upgrade
        closeOnBeforeunload: true,
        pingTimeout: 60000,
        pingInterval: 25000,
      })
    }
  };
}

/**
 * Test socket server connectivity
 */
export async function testSocketConnectivity(socketUrl?: string): Promise<{
  success: boolean;
  status: string;
  message: string;
  responseTime?: number;
}> {
  const url = socketUrl || getSocketConfig().url;
  const startTime = Date.now();
  
  try {
    // Test socket.io handshake endpoint
    const testUrl = `${url}/socket.io/?EIO=4&transport=polling`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const responseText = await response.text();
      
      // Check if it's a valid Socket.IO handshake response
      if (responseText.startsWith('0{')) {
        return {
          success: true,
          status: 'online',
          message: 'Socket server is reachable and responding correctly',
          responseTime
        };
      } else {
        return {
          success: false,
          status: 'invalid_response',
          message: 'Server responded but not with valid Socket.IO handshake',
          responseTime
        };
      }
    } else {
      return {
        success: false,
        status: 'http_error',
        message: `Server returned HTTP ${response.status}`,
        responseTime
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        status: 'timeout',
        message: 'Connection timeout - server may be unreachable',
        responseTime
      };
    }
    
    return {
      success: false,
      status: 'network_error',
      message: `Network error: ${error.message}`,
      responseTime
    };
  }
}

/**
 * Get auth configuration for socket connection
 */
export function getSocketAuthConfig(userId: string, userEmail: string) {
  return {
    auth: {
      userId,
      userEmail,
    },
    query: {
      userId,
      userEmail,
      clientType: 'nextdentist-web',
      buildTime: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      timestamp: Date.now(),
    },
    extraHeaders: {
      'X-Client-Type': 'nextdentist-web',
      'X-User-ID': userId,
      'X-Build-Env': process.env.NODE_ENV || 'development',
      'X-Socket-Version': '4.8.1',
    }
  };
}

/**
 * Socket error helper
 */
export function parseSocketError(error: any): {
  type: string;
  message: string;
  userMessage: string;
  isRetryable: boolean;
} {
  const errorMessage = error.message || error.toString();
  
  if (errorMessage.includes('CORS')) {
    return {
      type: 'cors',
      message: errorMessage,
      userMessage: 'Server configuration error. Please try again later.',
      isRetryable: false
    };
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
    return {
      type: 'timeout',
      message: errorMessage,
      userMessage: 'Connection timeout. Please check your internet connection.',
      isRetryable: true
    };
  }
  
  if (errorMessage.includes('websocket') || errorMessage.includes('WebSocket')) {
    return {
      type: 'websocket',
      message: errorMessage,
      userMessage: 'WebSocket connection failed, trying alternative transport.',
      isRetryable: true
    };
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      type: 'network',
      message: errorMessage,
      userMessage: 'Network connection error. Please check your internet.',
      isRetryable: true
    };
  }
  
  return {
    type: 'unknown',
    message: errorMessage,
    userMessage: 'Unable to connect to chat server. Please try again.',
    isRetryable: true
  };
} 