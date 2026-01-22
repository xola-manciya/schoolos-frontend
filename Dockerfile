# Frontend Dockerfile for React/Vite application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy only necessary source files for build
# This approach is more secure than COPY . .
COPY public/ ./public/
COPY src/ ./src/
COPY index.html ./
COPY vite.config.ts tsconfig.json tsconfig.node.json ./
COPY postcss.config.js tailwind.config.js ./
COPY nginx.conf ./

# Build the application
RUN pnpm build

# Production stage with Nginx
FROM nginx:alpine

# Create non-root user
RUN adduser -D -u 1000 nginxuser && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    chown -R nginxuser:nginxuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership of nginx files
RUN chown -R nginxuser:nginxuser /usr/share/nginx/html

# Switch to non-root user
USER nginxuser

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
