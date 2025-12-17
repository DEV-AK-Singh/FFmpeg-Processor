FROM node:20-slim

WORKDIR /repo

# ---- Install FFmpeg (stable) ----
RUN apt-get update \
 && apt-get install -y ffmpeg ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

# ---- pnpm ----
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Copy monorepo ----
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY apps ./apps

# ---- Install & build ----
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/shared build
RUN pnpm --filter worker build

WORKDIR /repo/apps/worker

CMD ["node", "dist/index.js"]
