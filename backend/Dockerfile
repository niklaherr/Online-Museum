# backend/Dockerfile
FROM node:18-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables (override at runtime or in docker-compose)
ENV NODE_ENV=production \
    PORT=3001 \
    DB_USER=user \
    DB_HOST=museum-db \
    DB_NAME=mydatabase \
    DB_PASSWORD=password \
    DB_PORT=5432 \
    JWT_SECRET=your-secret-key

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
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