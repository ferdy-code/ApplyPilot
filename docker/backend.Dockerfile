FROM oven/bun:1-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

# force env timezone to UTC, manual set timezone in code if needed
ENV TZ=UTC

WORKDIR /app

COPY services/backend/package.json .
COPY services/backend/bun.lock .

RUN bun install --frozen-lockfile

COPY services/backend /app

RUN bun storage:link

EXPOSE 3000

CMD ["bun", "start"]