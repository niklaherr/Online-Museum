# frontend/Dockerfile - PRODUCTION VERSION mit Build-Time ENV
FROM node:18-slim as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variable für BUILD-TIME
ENV REACT_APP_BACKEND_API_URL=https://museum-backend-production.up.railway.app
ENV REACT_APP_MISTRAL_API_KEY=SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs

# Set environment variables (override at runtime or in docker-compose)
ENV REACT_APP_BACKEND_API_URL=http://localhost:3001
ENV REACT_APP_MISTRAL_API_KEY=SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs

# Set environment variables (override at runtime or in docker-compose)
ENV REACT_APP_BACKEND_API_URL=http://localhost:3001
ENV REACT_APP_MISTRAL_API_KEY=SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs

# Build for production (Environment Variable wird eingebaut)
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 (für Railway)
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]