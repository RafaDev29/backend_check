# -------- Builder --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Instala TODAS las deps (incluye @nestjs/cli, typescript, etc. si están en dev)
RUN npm ci

COPY . .
RUN npm run build

# -------- Runner --------
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
# Solo deps de runtime
RUN npm ci --omit=dev

# Copiamos el build
COPY --from=builder /app/dist ./dist

EXPOSE 4070
CMD ["node", "dist/main.js"]
