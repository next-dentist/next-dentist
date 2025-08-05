/**
 * Next.js Production Server
 *
 * This server handles:
 * - Serving the Next.js application
 * - Static files and API routes
 * - SSR and ISR functionality
 */

require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log('🚀 Starting Next.js Server...');
console.log(`Environment: ${dev ? 'development' : 'production'}`);
console.log(`Port: ${port}`);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ HTTP Error:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Start HTTP Server
  httpServer
    .once('error', (err) => {
      console.error('❌ Next.js Server Error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Next.js Server ready at http://${hostname}:${port}`);
      console.log(`📝 Socket.IO server should be running separately on port 3001`);
    });
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Next.js Server received ${signal}. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); 