# Stage 1: Build
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built application and install production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Copy the service account key file (if using build args)
ARG FIRESTORE_SERVICE_ACCOUNT_KEY
RUN echo "$FIRESTORE_SERVICE_ACCOUNT_KEY" > /app/dist/service-account-firestore.json

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]