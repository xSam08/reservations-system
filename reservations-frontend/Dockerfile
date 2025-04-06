FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto
EXPOSE 4200

# Ejecuta la aplicación
CMD ["npm", "run", "start"]
