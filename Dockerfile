# Loosely based on the Next.js example:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:20.10.0-bullseye-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY *.json *.js *.mjs *.ts ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM base as runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
USER node
RUN mkdir -p /home/node/app/.next
WORKDIR /home/node/app
COPY --from=builder --chown=node:node /build/.next/standalone ./
COPY --from=builder --chown=node:node /build/.next/static ./.next/static
EXPOSE ${PORT}
CMD ["node", "server.js"]
