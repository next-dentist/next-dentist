# Socket.IO Server Deployment Guide

## Overview
This guide helps you deploy the Socket.IO server for NextDentist's live chat functionality on your production server.

## Production Architecture
- **Main Site**: `https://nextdentist.com` (Next.js app)
- **Socket Server**: `https://socket.nextdentist.com` (Dedicated Socket.IO server)
- **Database**: Shared MySQL database

## Prerequisites
- Node.js 18+ installed on production server
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate for `socket.nextdentist.com`

## Step 1: Server Setup

### 1.1 Create subdomain
Configure DNS for `socket.nextdentist.com` pointing to your server IP.

### 1.2 SSL Certificate
Obtain SSL certificate for `socket.nextdentist.com`:
```bash
# Using Certbot/Let's Encrypt
sudo certbot certonly --standalone -d socket.nextdentist.com
```

### 1.3 Upload Socket Server Files
Copy these files to your production server (e.g., `/var/www/socket-nextdentist/`):
- `temp/socket-server.js`
- `package.json` (with socket.io dependencies)
- `.env.production` (socket server environment)
- `prisma/schema.prisma`

## Step 2: Environment Configuration

### 2.1 Socket Server Environment
Create `/var/www/socket-nextdentist/.env`:
```env
NODE_ENV=production
PORT=3001
SOCKET_PORT=3001
HOSTNAME=socket.nextdentist.com
NEXT_PUBLIC_SITE_URL=https://nextdentist.com
CORS_ORIGIN=https://nextdentist.com
DATABASE_URL="mysql://nextdentistdb:vkuofll9YxI8eOwYHp7v@88.223.94.63:3306/nextdentist"
API_SECRET_KEY="N3xtD3nti$t@2025!"
SECRET_KEY="N3xtD3nti$t@2025!"
SESSION_SECRET="N3xtD3nti$t@2025!"
```

### 2.2 Main App Environment
Ensure your main Next.js app has:
```env
NEXT_PUBLIC_SOCKET_URL=https://socket.nextdentist.com
```

## Step 3: Nginx Configuration

### 3.1 Socket Server Proxy
Create `/etc/nginx/sites-available/socket-nextdentist`:
```nginx
server {
    listen 443 ssl http2;
    server_name socket.nextdentist.com;

    ssl_certificate /etc/letsencrypt/live/socket.nextdentist.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/socket.nextdentist.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Socket.IO specific configuration
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Socket.IO specific timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Disable buffering for real-time
        proxy_buffering off;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name socket.nextdentist.com;
    return 301 https://$server_name$request_uri;
}
```

### 3.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/socket-nextdentist /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: Install Dependencies

```bash
cd /var/www/socket-nextdentist
npm install socket.io @prisma/client dotenv
npx prisma generate
```

## Step 5: PM2 Configuration

### 5.1 Create PM2 Ecosystem
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'socket-nextdentist',
    script: 'socket-server.js',
    cwd: '/var/www/socket-nextdentist',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    error_file: '/var/log/pm2/socket-nextdentist-error.log',
    out_file: '/var/log/pm2/socket-nextdentist-out.log',
    log_file: '/var/log/pm2/socket-nextdentist.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000
  }]
};
```

### 5.2 Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Firewall Configuration

```bash
# Allow port 3001 for internal communication
sudo ufw allow from 127.0.0.1 to any port 3001
sudo ufw allow from 88.223.94.63 to any port 3001
```

## Step 7: Testing

### 7.1 Direct Socket Test
```bash
curl -v https://socket.nextdentist.com/socket.io/?EIO=4&transport=polling
```

### 7.2 Browser Console Test
In your browser console on `https://nextdentist.com`:
```javascript
console.log('Socket URL:', process.env.NEXT_PUBLIC_SOCKET_URL);
```

## Step 8: Monitoring

### 8.1 PM2 Monitoring
```bash
pm2 status
pm2 logs socket-nextdentist
pm2 monit
```

### 8.2 Health Check Script
Create `/var/www/socket-nextdentist/health-check.js`:
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/socket.io/?EIO=4&transport=polling',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('✅ Socket server is healthy');
    process.exit(0);
  } else {
    console.log('❌ Socket server unhealthy');
    process.exit(1);
  }
});

req.on('error', (error) => {
  console.error('❌ Health check failed:', error);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('❌ Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();
```

## Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Ensure CORS origins match exactly in both environments
```env
# Socket server
CORS_ORIGIN=https://nextdentist.com

# Main app  
NEXT_PUBLIC_SOCKET_URL=https://socket.nextdentist.com
```

### Issue 2: SSL Certificate Issues
**Solution**: Verify certificate is valid for subdomain
```bash
openssl s_client -connect socket.nextdentist.com:443 -servername socket.nextdentist.com
```

### Issue 3: Connection Timeouts
**Solution**: Check firewall and nginx proxy timeouts
```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s; 
proxy_read_timeout 60s;
```

### Issue 4: Database Connection Issues
**Solution**: Ensure database URL is correct and accessible
```bash
# Test database connection
cd /var/www/socket-nextdentist
npx prisma db push --preview-feature
```

## Troubleshooting Commands

```bash
# Check if socket server is running
netstat -tlnp | grep :3001

# Check nginx configuration
sudo nginx -t

# Check SSL certificate
curl -I https://socket.nextdentist.com

# Check socket server logs
pm2 logs socket-nextdentist

# Restart socket server
pm2 restart socket-nextdentist

# Check database connection
cd /var/www/socket-nextdentist && npx prisma studio
```

## Security Considerations

1. **Firewall**: Only allow necessary ports
2. **SSL**: Use strong SSL configuration
3. **Authentication**: Implement proper user authentication
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Logging**: Monitor for suspicious activity

## Maintenance

- Monitor PM2 processes daily
- Check SSL certificate expiry monthly
- Update dependencies regularly
- Monitor server resources
- Backup configuration files 