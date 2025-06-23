FROM node:20.18.0 AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig*.json ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20.18.0 AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY .npmrc ./
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/server.js"]
