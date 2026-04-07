#!/bin/bash

# PocketBase Deployment Script for Linux VPS
# This script sets up PocketBase on a Linux server

set -e

echo "🚀 PocketBase Deployment Script"
echo "================================"
echo ""

# Configuration
POCKETBASE_VERSION="0.23.8"
INSTALL_DIR="/opt/pocketbase"
SERVICE_USER="pocketbase"
DOMAIN="${POCKETBASE_DOMAIN:-localhost}"
PORT="${POCKETBASE_PORT:-8090}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

echo "📋 Configuration:"
echo "   Version: $POCKETBASE_VERSION"
echo "   Install Directory: $INSTALL_DIR"
echo "   Service User: $SERVICE_USER"
echo "   Domain: $DOMAIN"
echo "   Port: $PORT"
echo ""

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
  x86_64)
    POCKETBASE_ARCH="amd64"
    ;;
  aarch64|arm64)
    POCKETBASE_ARCH="arm64"
    ;;
  *)
    echo "❌ Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

echo "🔍 Detected architecture: $ARCH ($POCKETBASE_ARCH)"
echo ""

# Create service user
if ! id "$SERVICE_USER" &>/dev/null; then
  echo "👤 Creating service user: $SERVICE_USER"
  useradd -r -s /bin/false -d $INSTALL_DIR $SERVICE_USER
else
  echo "✅ Service user already exists: $SERVICE_USER"
fi
echo ""

# Create installation directory
echo "📁 Creating installation directory"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Download PocketBase
DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_${POCKETBASE_ARCH}.zip"
echo "⬇️  Downloading PocketBase from $DOWNLOAD_URL"
curl -L $DOWNLOAD_URL -o pocketbase.zip

# Extract
echo "📦 Extracting PocketBase"
unzip -o pocketbase.zip
rm pocketbase.zip
chmod +x pocketbase

# Set ownership
chown -R $SERVICE_USER:$SERVICE_USER $INSTALL_DIR

echo "✅ PocketBase binary installed"
echo ""

# Create systemd service
echo "⚙️  Creating systemd service"
cat > /etc/systemd/system/pocketbase.service <<EOF
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/pocketbase serve --http=0.0.0.0:$PORT
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$INSTALL_DIR

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
systemctl daemon-reload
systemctl enable pocketbase.service

echo "✅ Systemd service created and enabled"
echo ""

# Start the service
echo "🚀 Starting PocketBase service"
systemctl start pocketbase.service

# Wait a moment for the service to start
sleep 2

# Check service status
if systemctl is-active --quiet pocketbase.service; then
  echo "✅ PocketBase is running!"
else
  echo "⚠️  PocketBase service failed to start. Check logs with: journalctl -u pocketbase -f"
  exit 1
fi

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. PocketBase is running on port $PORT"
echo "   2. Access admin UI at: http://your-server-ip:$PORT/_/"
echo "   3. Set up Nginx reverse proxy (see nginx.conf example)"
echo "   4. Configure SSL with Let's Encrypt (see deploy-guide.md)"
echo ""
echo "🔧 Useful commands:"
echo "   Status:  systemctl status pocketbase"
echo "   Logs:    journalctl -u pocketbase -f"
echo "   Restart: systemctl restart pocketbase"
echo "   Stop:    systemctl stop pocketbase"
echo ""
