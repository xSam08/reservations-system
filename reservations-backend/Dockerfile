FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto
EXPOSE 3000

# Ejecuta la aplicación
CMD ["npm", "run", "start"]
