# backend/Dockerfile
FROM node:18-slim

# Install system dependencies including build tools for native modules
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    DB_USER=user \
    DB_HOST=museum-db \
    DB_NAME=mydatabase \
    DB_PASSWORD=password \
    DB_PORT=5432

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (this ensures bcrypt is compiled for the container's architecture)
RUN npm ci --only=production

# Copy source code (node_modules should be excluded via .dockerignore)
COPY . .

# Create non-root user
RUN groupadd -r museum && useradd -r -g museum museum
RUN chown -R museum:museum /app
USER museum

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]