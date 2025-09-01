# EMx Dashboard Production Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Copy built frontend to backend public directory
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Create logs directory
RUN mkdir -p backend/logs

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S emxuser -u 1001
RUN chown -R emxuser:nodejs /app
USER emxuser

# Start application
WORKDIR /app/backend
CMD ["node", "server.js"]
