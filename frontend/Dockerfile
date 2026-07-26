# Build stage
FROM node:20-alpine AS builder

ARG SESSION_SECRET
ARG NEXT_PUBLIC_APP_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js (standalone mode)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy standalone output (Next.js 16)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
