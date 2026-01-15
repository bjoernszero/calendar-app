FROM oven/bun:1
WORKDIR /app

# Copy backend package files
COPY package.json bun.lock ./

# Install backend dependencies
RUN bun install --frozen-lockfile

# Copy client package files
COPY client/package.json client/bun.lock* ./client/

# Install client dependencies
WORKDIR /app/client
RUN bun install

# Copy source code
WORKDIR /app
COPY . .

# Build client
WORKDIR /app/client
RUN bun run build

# Move build output to backend dist folder (or configured path)
WORKDIR /app
RUN rm -rf dist && mv client/dist dist

# Expose port
EXPOSE 8080

# Run the server
ENTRYPOINT [ "bun", "run", "index.ts" ]
