FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache git

RUN mkdir -p backend frontend

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm --filter "starwars-universe-explorer-frontend" run build

FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80