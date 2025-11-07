# --- Этап 1: сборка проекта ---
FROM node:20-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копируем package.json и lock-файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь проект
COPY . .

# Сборка проекта (Next.js)
RUN npm run build

# --- Этап 2: запуск продакшен-сервера ---
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем только нужное из сборки
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Определяем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "start"]
