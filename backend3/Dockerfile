# ===== MULTI-STAGE DOCKERFILE FOR WORKSPACES =====
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# ===== SHARED PACKAGE STAGE =====
FROM base AS shared-builder

# Copy and build shared package
COPY shared/ ./shared/
RUN cd shared && npm install && npm run build

# ===== DEPENDENCIES STAGE =====
FROM base AS dependencies

# Copy shared package from previous stage
COPY --from=shared-builder /app/shared ./shared

# Create service directories and copy package.json files
COPY api-gateway/package.json ./api-gateway/
COPY auth-service/package.json ./auth-service/
COPY user-service/package.json ./user-service/
COPY hotel-service/package.json ./hotel-service/
COPY reservation-service/package.json ./reservation-service/
COPY review-service/package.json ./review-service/
COPY notification-service/package.json ./notification-service/
COPY report-service/package.json ./report-service/
COPY payment-service/package.json ./payment-service/
COPY availability-service/package.json ./availability-service/
COPY search-service/package.json ./search-service/

# Install dependencies for each service
RUN for service in api-gateway auth-service user-service hotel-service reservation-service review-service notification-service report-service payment-service availability-service search-service; do \
  cd $service && \
  echo "Installing dependencies for $service..." && \
  npm install --production && \
  cd ..; \
done

# ===== BUILD STAGE =====
FROM dependencies AS builder

# Copy all source code
COPY api-gateway/ ./api-gateway/
COPY auth-service/ ./auth-service/
COPY user-service/ ./user-service/
COPY hotel-service/ ./hotel-service/
COPY reservation-service/ ./reservation-service/
COPY review-service/ ./review-service/
COPY notification-service/ ./notification-service/
COPY report-service/ ./report-service/
COPY payment-service/ ./payment-service/
COPY availability-service/ ./availability-service/
COPY search-service/ ./search-service/

# Build all services that have TypeScript
RUN for service in api-gateway auth-service user-service hotel-service reservation-service review-service notification-service report-service payment-service availability-service search-service; do \
  cd $service && \
  echo "Building $service..." && \
  if [ -f "tsconfig.json" ]; then \
    npm run build || echo "Build failed for $service, continuing..."; \
  fi && \
  cd ..; \
done

# ===== PRODUCTION BASE =====
FROM base AS production-base
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# ===== API GATEWAY =====
FROM production-base AS api-gateway
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/api-gateway/dist ./dist
COPY --from=builder /app/api-gateway/package.json ./
COPY --from=dependencies /app/api-gateway/node_modules ./node_modules
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/index.js"]

# ===== AUTH SERVICE =====
FROM production-base AS auth-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/auth-service/dist ./dist
COPY --from=builder /app/auth-service/package.json ./
COPY --from=dependencies /app/auth-service/node_modules ./node_modules
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== USER SERVICE =====
FROM production-base AS user-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/package.json ./
COPY --from=dependencies /app/user-service/node_modules ./node_modules
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== HOTEL SERVICE =====
FROM production-base AS hotel-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/hotel-service/dist ./dist
COPY --from=builder /app/hotel-service/package.json ./
COPY --from=dependencies /app/hotel-service/node_modules ./node_modules
EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== RESERVATION SERVICE =====
FROM production-base AS reservation-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/reservation-service/dist ./dist
COPY --from=builder /app/reservation-service/package.json ./
COPY --from=dependencies /app/reservation-service/node_modules ./node_modules
EXPOSE 3004
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3004/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== REVIEW SERVICE =====
FROM production-base AS review-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/review-service/dist ./dist
COPY --from=builder /app/review-service/package.json ./
COPY --from=dependencies /app/review-service/node_modules ./node_modules
EXPOSE 3005
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3005/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== NOTIFICATION SERVICE =====
FROM production-base AS notification-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/notification-service/dist ./dist
COPY --from=builder /app/notification-service/package.json ./
COPY --from=dependencies /app/notification-service/node_modules ./node_modules
EXPOSE 3006
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3006/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== REPORT SERVICE =====
FROM production-base AS report-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/report-service/dist ./dist
COPY --from=builder /app/report-service/package.json ./
COPY --from=dependencies /app/report-service/node_modules ./node_modules
EXPOSE 3007
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3007/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== PAYMENT SERVICE =====
FROM production-base AS payment-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/payment-service/dist ./dist
COPY --from=builder /app/payment-service/package.json ./
COPY --from=dependencies /app/payment-service/node_modules ./node_modules
EXPOSE 3008
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3008/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== AVAILABILITY SERVICE =====
FROM production-base AS availability-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/availability-service/dist ./dist
COPY --from=builder /app/availability-service/package.json ./
COPY --from=dependencies /app/availability-service/node_modules ./node_modules
EXPOSE 3009
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3009/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]

# ===== SEARCH SERVICE =====
FROM production-base AS search-service
COPY --from=shared-builder /app/shared ./shared
COPY --from=builder /app/search-service/dist ./dist
COPY --from=builder /app/search-service/package.json ./
COPY --from=dependencies /app/search-service/node_modules ./node_modules
EXPOSE 3010
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3010/health || exit 1
USER nodejs
CMD ["dumb-init", "node", "dist/main.js"]