# frontend/Dockerfile - PRODUCTION VERSION mit Build-Time ENV
FROM node:24.2.0-slim AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production (Environment Variable wird eingebaut)
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for nginx server
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]