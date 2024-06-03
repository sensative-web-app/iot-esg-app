# Loosely based on the Next.js example:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:20.10.0-bookworm-slim AS base
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
COPY requirements.txt .
RUN apt-get -y update && apt-get -y install --no-install-recommends \
    python3-minimal python3-venv
ENV PATH="/home/node/python/bin:${PATH}"
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
USER node
RUN python3 -m venv /home/node/python && \
    /home/node/python/bin/python3 -m pip install -r requirements.txt
RUN mkdir -p /home/node/app/.next /home/node/app/api
WORKDIR /home/node/app
COPY api/*.py api/
COPY *.py .
COPY *.xlsx .
COPY --from=builder --chown=node:node /build/.next/standalone ./
COPY --from=builder --chown=node:node /build/.next/static ./.next/static
EXPOSE ${PORT}
CMD ["node", "server.js"]
