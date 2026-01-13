# Build image
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY . .

RUN npm ci
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]