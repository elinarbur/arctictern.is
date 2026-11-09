# ---- build stage: full toolchain, never shipped ----
FROM node:26-trixie-slim AS build
WORKDIR /app
RUN npm install -g pnpm@10.10.0
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile
COPY . /app
RUN pnpm run build && pnpm prune --prod

# ---- runtime stage: what actually gets deployed and scanned ----
FROM node:26-trixie-slim
# Pull Debian security fixes (e.g. zlib1g) and drop the bundled npm/corepack,
# which carry their own vulnerable copies of brace-expansion/undici and aren't
# needed at runtime.
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
              /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
WORKDIR /app
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT
ENV NODE_ENV=production
ENV TS_NODE_BASEURL=./.build
COPY --from=build /app/package.json /app/tsconfig.json /app/
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.build /app/.build
# express.static / view lookup resolve relative to the working directory
COPY --from=build /app/views /app/views
COPY --from=build /app/static /app/static
COPY --from=build /app/webroot /app/webroot
USER node
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD node -e "fetch('http://127.1.1.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "-r", "tsconfig-paths/register", ".build/src/server.js"]
