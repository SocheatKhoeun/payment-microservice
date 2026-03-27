FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci || true

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

# Install production deps
RUN npm ci --only=production || true

EXPOSE 3000
CMD ["node", "dist/main"]
