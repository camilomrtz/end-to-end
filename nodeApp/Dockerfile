FROM node:18
WORKDIR /app

# Crea un package.json básico dentro del contenedor
RUN npm init -y
RUN npm install express

COPY . .
CMD ["node", "app.js"]