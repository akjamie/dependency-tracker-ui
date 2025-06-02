# Build stage
FROM node:24-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .npmrc ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.28.0-alpine

# Add bash and curl for environment variable substitution and health check
RUN apk add --no-cache bash curl

# Copy the built application from build stage
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy the entrypoint script and env.js template
COPY docker-entrypoint.sh /usr/local/bin/
COPY public/env.js /usr/share/nginx/html/env.js.template
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create directory for environment files and set permissions
RUN mkdir -p /usr/share/nginx/html/env && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Set environment variables with defaults
ENV API_URL=http://localhost:8080/dependency-tracker
ENV ENABLE_ANALYTICS=false
ENV ENABLE_LOGGING=true
ENV APP_NAME=Dependency\ Tracker
ENV APP_VERSION=1.0.0

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 