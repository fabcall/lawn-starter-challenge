FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache git

RUN mkdir -p backend frontend

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm --filter "starwars-universe-explorer-backend" run build

RUN pnpm deploy --filter "starwars-universe-explorer-backend" --prod /prod-api --legacy

FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /prod-api .

COPY --from=builder /app/backend/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]