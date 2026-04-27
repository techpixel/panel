FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/panel/package.json ./apps/panel/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/panel/node_modules ./apps/panel/node_modules
COPY . .
RUN pnpm --filter @panel/app build
RUN pnpm --filter @panel/app deploy --prod /prod/panel

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /repo/apps/panel/build ./build
COPY --from=builder /prod/panel/node_modules ./node_modules
COPY --from=builder /repo/apps/panel/package.json ./

EXPOSE 3000
CMD ["node", "build/index.js"]
