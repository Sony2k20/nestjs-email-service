# Stage 1: Build
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

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
RUN npm install --production

# Copy the service account key file (if using build args)
ARG FIRESTORE_SERVICE_ACCOUNT_KEY
RUN echo "$FIRESTORE_SERVICE_ACCOUNT_KEY" > /app/service-account-key.json

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
