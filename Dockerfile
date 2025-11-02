# Usa una imagen oficial de Node.js como base
FROM node:20-alpine AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos esenciales para instalar dependencias
COPY package.json package-lock.json* npm-lock.yaml* ./

# Instala las dependencias sin generar archivos innecesarios
RUN corepack enable && npm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# ---------------------------------
# Fase final: Imagen ligera para producción
# ---------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copia solo los archivos necesarios desde la fase de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./
RUN corepack enable && npm ci --omit=dev

# Establece la variable de entorno para producción
ENV NODE_ENV=production

# Expone el puerto por defecto de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]