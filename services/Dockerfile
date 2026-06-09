FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG SERVICE
RUN npm run build $SERVICE

# ── Runtime image ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ARG SERVICE
ENV SERVICE=${SERVICE}
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist/apps/${SERVICE} ./dist

CMD ["node", "dist/main"]
