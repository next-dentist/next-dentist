#!/usr/bin/env node
/**
 * NextDentist Socket.IO Connection Diagnostic Tool
 * 
 * This script helps diagnose connection issues between the Next.js app 
 * and the Socket.IO server in production.
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const config = {
  mainSiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://nextdentist.com',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.nextdentist.com',
  corsOrigin: process.env.CORS_ORIGIN || 'https://nextdentist.com',
  environment: process.env.NODE_ENV || 'production'
};

console.log('🔍 NextDentist Socket.IO Diagnostic Tool');
console.log('==========================================\n');

console.log('📋 Configuration:');
console.log(`Main Site: ${config.mainSiteUrl}`);
console.log(`Socket URL: ${config.socketUrl}`);
console.log(`CORS Origin: ${config.corsOrigin}`);
console.log(`Environment: ${config.environment}\n`);

// Test results storage
const results = {
  dnsResolution: false,
  sslCertificate: false,
  socketHandshake: false,
  corsConfig: false,
  serverRunning: false,
  overallHealth: false
};

// Helper function to make HTTP/HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'NextDentist-Diagnostic/1.0',
        ...options.headers
      },
      timeout: 10000,
      ...options
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        code: error.code,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'TIMEOUT',
        url: url
      });
    });

    req.end();
  });
}

// Test 1: DNS Resolution
async function testDnsResolution() {
  console.log('🌐 Testing DNS Resolution...');
  
  try {
    const urlObj = new URL(config.socketUrl);
    const hostname = urlObj.hostname;
    
    // Simple connection test
    await makeRequest(config.socketUrl);
    console.log(`   ✅ DNS resolution successful for ${hostname}`);
    results.dnsResolution = true;
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.log(`   ❌ DNS resolution failed: ${error.error}`);
      console.log(`   💡 Check if ${new URL(config.socketUrl).hostname} exists and points to correct IP`);
    } else {
      console.log(`   ⚠️  DNS seems OK, but connection failed: ${error.error}`);
      results.dnsResolution = true; // DNS is OK, other issues exist
    }
  }
}

// Test 2: SSL Certificate
async function testSSLCertificate() {
  console.log('🔐 Testing SSL Certificate...');
  
  if (!config.socketUrl.startsWith('https://')) {
    console.log('   ⚠️  Socket URL is not HTTPS - SSL test skipped');
    results.sslCertificate = true; // Not applicable
    return;
  }

  try {
    const response = await makeRequest(config.socketUrl);
    console.log(`   ✅ SSL certificate is valid`);
    results.sslCertificate = true;
  } catch (error) {
    if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      console.log(`   ❌ SSL certificate issue: ${error.error}`);
      console.log(`   💡 Check SSL certificate for ${new URL(config.socketUrl).hostname}`);
    } else {
      console.log(`   ⚠️  SSL seems OK, but connection failed: ${error.error}`);
      results.sslCertificate = true;
    }
  }
}

// Test 3: Socket.IO Handshake
async function testSocketHandshake() {
  console.log('🤝 Testing Socket.IO Handshake...');
  
  const handshakeUrl = `${config.socketUrl}/socket.io/?EIO=4&transport=polling`;
  
  try {
    const response = await makeRequest(handshakeUrl);
    
    if (response.statusCode === 200) {
      console.log(`   ✅ Socket.IO handshake successful`);
      console.log(`   📊 Response: ${response.data.substring(0, 100)}...`);
      results.socketHandshake = true;
      results.serverRunning = true;
    } else {
      console.log(`   ❌ Socket.IO handshake failed: HTTP ${response.statusCode}`);
      console.log(`   💡 Socket.IO server might not be running or configured correctly`);
    }
  } catch (error) {
    console.log(`   ❌ Socket.IO handshake failed: ${error.error}`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`   💡 Socket server is not running on the specified port`);
    }
  }
}

// Test 4: CORS Configuration
async function testCORSConfiguration() {
  console.log('🌍 Testing CORS Configuration...');
  
  const handshakeUrl = `${config.socketUrl}/socket.io/?EIO=4&transport=polling`;
  
  try {
    const response = await makeRequest(handshakeUrl, {
      headers: {
        'Origin': config.corsOrigin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
      'access-control-allow-methods': response.headers['access-control-allow-methods']
    };
    
    console.log('   📋 CORS Headers received:');
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (value) {
        console.log(`      ${key}: ${value}`);
      }
    });
    
    if (corsHeaders['access-control-allow-origin'] === config.corsOrigin || 
        corsHeaders['access-control-allow-origin'] === '*') {
      console.log(`   ✅ CORS configuration allows origin: ${config.corsOrigin}`);
      results.corsConfig = true;
    } else {
      console.log(`   ❌ CORS configuration issue`);
      console.log(`   💡 Expected origin: ${config.corsOrigin}`);
      console.log(`   💡 Allowed origin: ${corsHeaders['access-control-allow-origin'] || 'none'}`);
    }
  } catch (error) {
    console.log(`   ❌ CORS test failed: ${error.error}`);
  }
}

// Test 5: Port Connectivity
async function testPortConnectivity() {
  console.log('🔌 Testing Port Connectivity...');
  
  const urlObj = new URL(config.socketUrl);
  const port = urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
  
  try {
    await makeRequest(config.socketUrl);
    console.log(`   ✅ Port ${port} is accessible`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ❌ Port ${port} connection refused`);
      console.log(`   💡 Check if the socket server is running and listening on port ${port}`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`   ❌ Port ${port} connection timeout`);
      console.log(`   💡 Check firewall settings and server configuration`);
    } else {
      console.log(`   ⚠️  Port connectivity issue: ${error.error}`);
    }
  }
}

// Test 6: Main site accessibility
async function testMainSiteAccessibility() {
  console.log('🏠 Testing Main Site Accessibility...');
  
  try {
    const response = await makeRequest(config.mainSiteUrl);
    if (response.statusCode === 200) {
      console.log(`   ✅ Main site is accessible`);
    } else {
      console.log(`   ⚠️  Main site returned HTTP ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`   ❌ Main site accessibility issue: ${error.error}`);
  }
}

// Generate recommendations
function generateRecommendations() {
  console.log('\n📝 Recommendations:');
  console.log('==================');
  
  if (!results.dnsResolution) {
    console.log('🔧 DNS Resolution Issues:');
    console.log('   - Check DNS records for socket.nextdentist.com');
    console.log('   - Ensure A record points to correct server IP');
    console.log('   - Wait for DNS propagation (up to 48 hours)\n');
  }
  
  if (!results.sslCertificate) {
    console.log('🔧 SSL Certificate Issues:');
    console.log('   - Install SSL certificate for socket.nextdentist.com');
    console.log('   - Use: sudo certbot certonly --standalone -d socket.nextdentist.com');
    console.log('   - Ensure certificate is valid and not expired\n');
  }
  
  if (!results.serverRunning) {
    console.log('🔧 Socket Server Issues:');
    console.log('   - Start the socket server: pm2 start socket-server.js');
    console.log('   - Check server logs: pm2 logs socket-nextdentist');
    console.log('   - Verify port 3001 is open and listening');
    console.log('   - Check server configuration in /var/www/socket-nextdentist/\n');
  }
  
  if (!results.socketHandshake) {
    console.log('🔧 Socket.IO Handshake Issues:');
    console.log('   - Verify Socket.IO server is properly configured');
    console.log('   - Check nginx proxy configuration');
    console.log('   - Ensure WebSocket support is enabled\n');
  }
  
  if (!results.corsConfig) {
    console.log('🔧 CORS Configuration Issues:');
    console.log('   - Update socket server CORS settings');
    console.log('   - Ensure CORS_ORIGIN matches main site URL');
    console.log('   - Check environment variables are correctly set\n');
  }
  
  // Overall health assessment
  const healthyTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📊 Overall Health: ${healthyTests}/${totalTests} tests passed`);
  
  if (healthyTests === totalTests) {
    console.log('🎉 All tests passed! Your socket configuration appears to be working correctly.');
    results.overallHealth = true;
  } else if (healthyTests >= totalTests * 0.7) {
    console.log('⚠️  Most tests passed, but there are some issues to address.');
  } else {
    console.log('❌ Multiple issues detected. Please review the recommendations above.');
  }
}

// Main execution
async function runDiagnostics() {
  try {
    await testDnsResolution();
    console.log('');
    
    await testSSLCertificate();
    console.log('');
    
    await testSocketHandshake();
    console.log('');
    
    await testCORSConfiguration();
    console.log('');
    
    await testPortConnectivity();
    console.log('');
    
    await testMainSiteAccessibility();
    
    generateRecommendations();
    
  } catch (error) {
    console.error('💥 Diagnostic tool encountered an unexpected error:', error);
  }
}

// Run the diagnostics
runDiagnostics(); 