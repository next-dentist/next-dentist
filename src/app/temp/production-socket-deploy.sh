#!/bin/bash
# NextDentist Socket.IO Server Production Deployment Script

set -e  # Exit on any error

echo "🚀 Starting NextDentist Socket.IO Server Deployment..."

# Configuration
SOCKET_DIR="/var/www/socket-nextdentist"
BACKUP_DIR="/var/backups/socket-nextdentist-$(date +%Y%m%d-%H%M%S)"
NGINX_SITE="socket-nextdentist"
PM2_APP="socket-nextdentist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if required commands exist
check_dependencies() {
    print_status "Checking dependencies..."
    
    local deps=("node" "npm" "pm2" "nginx")
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            print_error "$dep is not installed"
            exit 1
        fi
    done
    
    print_status "All dependencies found ✅"
}

# Create directory structure
setup_directories() {
    print_status "Setting up directory structure..."
    
    sudo mkdir -p $SOCKET_DIR
    sudo mkdir -p /var/log/pm2
    sudo chown -R $USER:$USER $SOCKET_DIR
    
    print_status "Directories created ✅"
}

# Backup existing installation
backup_existing() {
    if [ -d "$SOCKET_DIR" ] && [ "$(ls -A $SOCKET_DIR)" ]; then
        print_status "Backing up existing installation..."
        sudo mkdir -p $(dirname $BACKUP_DIR)
        sudo cp -r $SOCKET_DIR $BACKUP_DIR
        print_status "Backup created at $BACKUP_DIR ✅"
    fi
}

# Deploy application files
deploy_files() {
    print_status "Deploying application files..."
    
    # Copy main application files
    cp temp/socket-server.js $SOCKET_DIR/
    
    # Create package.json if it doesn't exist
    if [ ! -f "$SOCKET_DIR/package.json" ]; then
        cat > $SOCKET_DIR/package.json << 'EOF'
{
  "name": "nextdentist-socket-server",
  "version": "1.0.0",
  "description": "Socket.IO server for NextDentist chat functionality",
  "main": "socket-server.js",
  "scripts": {
    "start": "node socket-server.js",
    "dev": "NODE_ENV=development node socket-server.js"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "dotenv": "^16.3.1",
    "socket.io": "^4.8.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
    fi
    
    # Create production environment file
    cat > $SOCKET_DIR/.env << 'EOF'
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
EOF
    
    # Copy Prisma schema
    mkdir -p $SOCKET_DIR/prisma
    cp prisma/schema.prisma $SOCKET_DIR/prisma/
    
    print_status "Application files deployed ✅"
}

# Install dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    cd $SOCKET_DIR
    npm install --production
    npx prisma generate
    
    print_status "Dependencies installed ✅"
}

# Configure PM2
setup_pm2() {
    print_status "Configuring PM2..."
    
    cat > $SOCKET_DIR/ecosystem.config.js << 'EOF'
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
EOF
    
    print_status "PM2 configuration created ✅"
}

# Configure Nginx
setup_nginx() {
    print_status "Configuring Nginx..."
    
    sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null << 'EOF'
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
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_status "Nginx configuration is valid ✅"
        sudo systemctl reload nginx
        print_status "Nginx reloaded ✅"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Create health check script
create_health_check() {
    print_status "Creating health check script..."
    
    cat > $SOCKET_DIR/health-check.js << 'EOF'
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
EOF
    
    chmod +x $SOCKET_DIR/health-check.js
    print_status "Health check script created ✅"
}

# Start the application
start_application() {
    print_status "Starting application with PM2..."
    
    cd $SOCKET_DIR
    
    # Stop existing PM2 process if running
    pm2 delete $PM2_APP 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js
    pm2 save
    
    print_status "Application started ✅"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if PM2 process is running
    if pm2 list | grep -q $PM2_APP; then
        print_status "PM2 process is running ✅"
    else
        print_error "PM2 process is not running"
        exit 1
    fi
    
    # Wait a moment for the server to start
    sleep 5
    
    # Check if port is listening
    if netstat -tlnp | grep -q :3001; then
        print_status "Server is listening on port 3001 ✅"
    else
        print_error "Server is not listening on port 3001"
        exit 1
    fi
    
    # Run health check
    if cd $SOCKET_DIR && node health-check.js; then
        print_status "Health check passed ✅"
    else
        print_warning "Health check failed - server might still be starting"
    fi
}

# Main execution
main() {
    print_status "🚀 NextDentist Socket.IO Server Deployment Started"
    
    check_dependencies
    backup_existing
    setup_directories
    deploy_files
    install_dependencies
    setup_pm2
    setup_nginx
    create_health_check
    start_application
    verify_deployment
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Obtain SSL certificate for socket.nextdentist.com:"
    echo "   sudo certbot certonly --standalone -d socket.nextdentist.com"
    echo ""
    echo "2. Update your main app's .env.production with:"
    echo "   NEXT_PUBLIC_SOCKET_URL=https://socket.nextdentist.com"
    echo ""
    echo "3. Test the connection:"
    echo "   curl -v https://socket.nextdentist.com/socket.io/?EIO=4&transport=polling"
    echo ""
    echo "4. Monitor logs:"
    echo "   pm2 logs socket-nextdentist"
    echo ""
}

# Run main function
main "$@" 