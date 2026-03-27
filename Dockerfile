FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps (install devDependencies so `nest build` is available)
COPY package.json pnpm-lock.yaml* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production artifacts and node_modules from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]
