#!/bin/bash

# EMx Dashboard Production Deployment Script
# Version: 1.1.0

echo "🚀 Starting EMx Dashboard Production Deployment..."

# Set production environment
export NODE_ENV=production

# Create logs directory
mkdir -p backend/logs

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm ci --only=production

# Initialize production database
echo "🗄️ Setting up production database..."
node config/init-db.js

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd ../frontend
npm ci
npm run build

# Copy built frontend to backend public directory
echo "📁 Copying frontend build to backend..."
mkdir -p ../backend/public
cp -r dist/* ../backend/public/

# Return to backend directory
cd ../backend

# Start production server
echo "🌟 Starting production server..."
echo "✅ EMx Dashboard v1.1.0 deployed successfully!"
echo "🌐 Server will start on port 3001"
echo "📊 Dashboard ready at: http://localhost:3001"

# Start with PM2 for production process management
if command -v pm2 &> /dev/null; then
    echo "🔄 Starting with PM2..."
    pm2 start server.js --name "emx-dashboard" --env production
    pm2 save
    pm2 startup
else
    echo "⚠️ PM2 not found. Starting with Node.js..."
    node server.js
fi
