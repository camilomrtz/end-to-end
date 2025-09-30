FROM node:18-alpine

WORKDIR /app

# Copia el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias EXACTAMENTE como están en package.json
RUN npm install --production

# Instala prometheus client
RUN npm install prom-client

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 3000

# Ejecuta la aplicación
CMD ["npm", "start"]