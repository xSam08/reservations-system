# Etapa de build
FROM node:18-alpine as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration=production

# Etapa de producción con NGINX
FROM nginx:alpine

COPY --from=builder /app/dist/reservations-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
