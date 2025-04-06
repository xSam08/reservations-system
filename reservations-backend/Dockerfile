# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build and expose port
RUN npm run build
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]