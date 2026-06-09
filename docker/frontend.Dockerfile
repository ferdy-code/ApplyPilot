FROM oven/bun:1-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

# force env timezone to UTC, manual set timezone in code if needed
ENV TZ=UTC

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --frozen-lockfile

COPY . /app

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]