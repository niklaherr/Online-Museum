# frontend/Dockerfile
FROM node:18-slim

# Set environment variables
ENV REACT_APP_BACKEND_API_URL=http://localhost:3001
ENV GENERATE_SOURCEMAP=false
ENV HOST=0.0.0.0
ENV BROWSER=none

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Create non-root user early (before copying source files)
RUN groupadd -r museum && useradd -r -g museum museum

# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Change ownership (fewer files to process now)
RUN chown -R museum:museum /app

# Switch to non-root user
USER museum

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]