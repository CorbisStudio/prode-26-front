# =============================================================================
# World Cup Prode - Angular Frontend
# =============================================================================

ARG NODE_VERSION=22
ARG NGINX_VERSION=alpine

FROM node:${NODE_VERSION}-slim AS deps

WORKDIR /app

RUN npm install -g pnpm@9.15.9

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /app

RUN npm install -g pnpm@9.15.9

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

ENV CI=true

RUN pnpm run build

FROM nginx:${NGINX_VERSION} AS production

LABEL maintainer="DevOps Team"
LABEL app="world-cup-prode"
LABEL stage="production"

# Install security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/world-cup-prode/browser /usr/share/nginx/html

RUN addgroup -g 1001 -S nginx-group && \
    adduser -S nginx-user -u 1001 -G nginx-group

# Fix permissions
RUN chown -R nginx-user:nginx-group /usr/share/nginx/html && \
    chown -R nginx-user:nginx-group /var/cache/nginx && \
    chown -R nginx-user:nginx-group /var/log/nginx && \
    chown -R nginx-user:nginx-group /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx-user:nginx-group /var/run/nginx.pid

USER nginx-user

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

FROM node:${NODE_VERSION}-slim AS development

WORKDIR /app

RUN npm install -g pnpm@9.15.9

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV CI=true

EXPOSE 4200

CMD ["pnpm", "run", "start", "--", "--host", "0.0.0.0"]
