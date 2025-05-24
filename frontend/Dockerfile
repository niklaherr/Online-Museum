
# frontend/Dockerfile
FROM node:18-slim

ENV REACT_APP_BACKEND_API_URL=http://localhost:3001
# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create non-root user
RUN groupadd -r museum && useradd -r -g museum museum
RUN chown -R museum:museum /app
USER museum

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]