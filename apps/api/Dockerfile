FROM node:22-alpine

WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/shared build
RUN pnpm --filter api build

WORKDIR /repo/apps/api

EXPOSE 3000
CMD ["node", "dist/index.js"]
