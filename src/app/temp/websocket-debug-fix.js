#!/usr/bin/env node
/**
 * WebSocket Connection Debug and Fix Tool for NextDentist
 * 
 * This script specifically diagnoses and helps fix WebSocket connection issues
 * when getting "WebSocket is closed before the connection is established" errors.
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

console.log('🔧 NextDentist WebSocket Debug Tool');
console.log('=====================================\n');

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.nextdentist.com';
console.log(`🎯 Target: ${socketUrl}\n`);

// Test 1: Basic HTTP connectivity
async function testHTTPConnectivity() {
  console.log('📡 Testing HTTP Connectivity...');
  
  try {
    const url = new URL(socketUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const response = await new Promise((resolve, reject) => {
      const req = client.get(socketUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
    
    console.log(`   ✅ HTTP connection successful (${response.status})`);
    return true;
  } catch (error) {
    console.log(`   ❌ HTTP connection failed: ${error.message}`);
    return false;
  }
}

// Test 2: Socket.IO Polling handshake
async function testPollingHandshake() {
  console.log('🤝 Testing Socket.IO Polling Handshake...');
  
  try {
    const handshakeUrl = `${socketUrl}/socket.io/?EIO=4&transport=polling`;
    const url = new URL(handshakeUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const response = await new Promise((resolve, reject) => {
      const req = client.get(handshakeUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
    
    if (response.status === 200 && response.data.startsWith('0{')) {
      console.log(`   ✅ Polling handshake successful`);
      const handshakeData = JSON.parse(response.data.substring(1));
      console.log(`   📋 Session ID: ${handshakeData.sid}`);
      console.log(`   📋 Ping Interval: ${handshakeData.pingInterval}ms`);
      console.log(`   📋 Ping Timeout: ${handshakeData.pingTimeout}ms`);
      console.log(`   📋 Upgrades: ${handshakeData.upgrades.join(', ')}`);
      return handshakeData;
    } else {
      console.log(`   ❌ Polling handshake failed (${response.status})`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Polling handshake error: ${error.message}`);
    return null;
  }
}

// Test 3: WebSocket upgrade test
async function testWebSocketUpgrade() {
  console.log('🚀 Testing WebSocket Upgrade Capability...');
  
  try {
    const wsUrl = socketUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const testUrl = `${wsUrl}/socket.io/?EIO=4&transport=websocket`;
    
    // Check if WebSocket upgrade headers are supported
    const url = new URL(socketUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const response = await new Promise((resolve, reject) => {
      const req = client.request({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: '/socket.io/?EIO=4&transport=polling',
        method: 'GET',
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
          'Origin': 'https://nextdentist.com'
        }
      }, (res) => {
        resolve({ status: res.statusCode, headers: res.headers });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.end();
    });
    
    const upgradeSupported = response.headers.upgrade === 'websocket' || 
                           response.headers.connection?.toLowerCase().includes('upgrade');
    
    if (upgradeSupported) {
      console.log(`   ✅ WebSocket upgrade supported`);
      console.log(`   📋 Upgrade header: ${response.headers.upgrade}`);
      console.log(`   📋 Connection header: ${response.headers.connection}`);
    } else {
      console.log(`   ❌ WebSocket upgrade not supported`);
      console.log(`   📋 Server response: ${response.status}`);
      console.log(`   📋 Headers: ${JSON.stringify(response.headers, null, 2)}`);
    }
    
    return upgradeSupported;
  } catch (error) {
    console.log(`   ❌ WebSocket upgrade test failed: ${error.message}`);
    return false;
  }
}

// Test 4: Check nginx configuration
async function checkNginxConfig() {
  console.log('⚙️  Checking Nginx Configuration...');
  
  console.log('   📋 Required nginx configuration for WebSocket:');
  console.log('   ```');
  console.log('   location /socket.io/ {');
  console.log('       proxy_pass http://localhost:3001;');
  console.log('       proxy_http_version 1.1;');
  console.log('       proxy_set_header Upgrade $http_upgrade;');
  console.log('       proxy_set_header Connection "upgrade";');
  console.log('       proxy_set_header Host $host;');
  console.log('       proxy_set_header X-Real-IP $remote_addr;');
  console.log('       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;');
  console.log('       proxy_set_header X-Forwarded-Proto $scheme;');
  console.log('       proxy_connect_timeout 60s;');
  console.log('       proxy_send_timeout 60s;');
  console.log('       proxy_read_timeout 60s;');
  console.log('       proxy_buffering off;');
  console.log('   }');
  console.log('   ```\n');
}

// Test 5: SSL certificate check
async function checkSSLCertificate() {
  console.log('🔐 Checking SSL Certificate...');
  
  if (!socketUrl.startsWith('https://')) {
    console.log('   ⚠️  Not using HTTPS - SSL check skipped');
    return true;
  }
  
  try {
    const url = new URL(socketUrl);
    
    const response = await new Promise((resolve, reject) => {
      const req = https.get({
        hostname: url.hostname,
        port: url.port || 443,
        path: '/',
        rejectUnauthorized: true
      }, (res) => {
        resolve({ cert: res.socket.getPeerCertificate(), status: res.statusCode });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
    
    console.log(`   ✅ SSL certificate valid`);
    console.log(`   📋 Subject: ${response.cert.subject.CN}`);
    console.log(`   📋 Issuer: ${response.cert.issuer.CN}`);
    console.log(`   📋 Valid from: ${new Date(response.cert.valid_from)}`);
    console.log(`   📋 Valid to: ${new Date(response.cert.valid_to)}`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ SSL certificate error: ${error.message}`);
    return false;
  }
}

// Generate fix recommendations
function generateWebSocketFixes(results) {
  console.log('\n🔧 WebSocket Fix Recommendations:');
  console.log('================================\n');
  
  if (!results.http) {
    console.log('❌ Fix HTTP Connectivity First:');
    console.log('   - Check if socket.nextdentist.com resolves correctly');
    console.log('   - Verify server is running and accessible');
    console.log('   - Check firewall settings\n');
  }
  
  if (!results.polling) {
    console.log('❌ Fix Socket.IO Server:');
    console.log('   - Ensure Socket.IO server is running on port 3001');
    console.log('   - Check PM2 status: pm2 logs socket-nextdentist');
    console.log('   - Verify environment variables are correct\n');
  }
  
  if (!results.websocket) {
    console.log('❌ Fix WebSocket Upgrade (Main Issue):');
    console.log('   - Update nginx configuration with proper WebSocket headers');
    console.log('   - Ensure proxy_set_header Upgrade $http_upgrade;');
    console.log('   - Ensure proxy_set_header Connection "upgrade";');
    console.log('   - Reload nginx: sudo systemctl reload nginx\n');
  }
  
  if (!results.ssl) {
    console.log('❌ Fix SSL Certificate:');
    console.log('   - Get SSL certificate for socket.nextdentist.com');
    console.log('   - Use: sudo certbot certonly --standalone -d socket.nextdentist.com');
    console.log('   - Update nginx SSL configuration\n');
  }
  
  console.log('💡 Quick Fix for WebSocket Issues:');
  console.log('==================================');
  console.log('1. Update client to start with polling:');
  console.log('   transports: ["polling", "websocket"]');
  console.log('');
  console.log('2. Fix nginx WebSocket configuration:');
  console.log('   - Add Upgrade and Connection headers');
  console.log('   - Increase proxy timeouts');
  console.log('   - Disable buffering');
  console.log('');
  console.log('3. Test with curl:');
  console.log(`   curl -v '${socketUrl}/socket.io/?EIO=4&transport=polling'`);
  console.log('');
  console.log('4. Monitor logs:');
  console.log('   pm2 logs socket-nextdentist');
  console.log('   sudo tail -f /var/log/nginx/error.log');
}

// Main execution
async function runWebSocketDiagnostics() {
  const results = {
    http: false,
    polling: false,
    websocket: false,
    ssl: false
  };
  
  results.http = await testHTTPConnectivity();
  console.log('');
  
  if (results.http) {
    const handshakeData = await testPollingHandshake();
    results.polling = !!handshakeData;
    console.log('');
    
    if (results.polling) {
      results.websocket = await testWebSocketUpgrade();
      console.log('');
    }
  }
  
  results.ssl = await checkSSLCertificate();
  console.log('');
  
  await checkNginxConfig();
  
  generateWebSocketFixes(results);
  
  // Summary
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`\n📊 Diagnostic Summary: ${passed}/${total} tests passed`);
  
  if (results.polling && !results.websocket) {
    console.log('');
    console.log('🎯 DIAGNOSIS: Polling works, WebSocket upgrade fails');
    console.log('💡 SOLUTION: Fix nginx WebSocket configuration');
    console.log('🔧 ACTION: Update nginx proxy headers for WebSocket support');
  } else if (!results.polling) {
    console.log('');
    console.log('🎯 DIAGNOSIS: Socket.IO server not responding');
    console.log('💡 SOLUTION: Check if socket server is running');
    console.log('🔧 ACTION: Start socket server with PM2');
  } else if (results.websocket) {
    console.log('');
    console.log('🎉 All tests passed - WebSocket should work!');
    console.log('💡 If still having issues, check client-side transport configuration');
  }
}

// Run diagnostics
runWebSocketDiagnostics().catch(console.error); 