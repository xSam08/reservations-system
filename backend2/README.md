# Sistema de Reservas de Hoteles - BreazeInTheMoon

Este proyecto implementa un sistema de reservas de hoteles utilizando una arquitectura de microservicios.

## Estructura del Proyecto

```
backend2/
├── api-gateway/           # Punto de entrada para todas las solicitudes API
├── auth-service/          # Servicio de autenticación y autorización
├── hotel-service/         # Gestión de hoteles
├── notification-service/  # Envío de notificaciones (email, SMS)
├── payment-service/       # Procesamiento de pagos
├── report-service/        # Generación de informes y estadísticas
├── reservation-service/   # Gestión de reservas
├── review-service/        # Gestión de reseñas y calificaciones
├── room-service/          # Gestión de habitaciones
├── shared/                # Código compartido entre servicios (entidades, DTOs, etc.)
├── user-service/          # Gestión de usuarios
├── docker-compose.yml     # Configuración de Docker Compose
└── README.md              # Documentación del proyecto
```

## Tecnologías Utilizadas

- **Backend**: NestJS (Node.js)
- **Base de Datos**: MySQL 8
- **Contenedores**: Docker & Docker Compose
- **Comunicación entre servicios**: TCP (Microservices)
- **Autenticación**: JWT
- **Documentación API**: Swagger
- **Notificaciones SMS**: Twilio
- **Notificaciones Email**: NodeMailer

## Microservicios

1. **API Gateway**: Punto de entrada único para todas las solicitudes API, enruta las peticiones a los servicios correspondientes.
2. **Auth Service**: Gestiona la autenticación (login, registro) y autorización basada en roles.
3. **User Service**: Gestiona información de usuarios.
4. **Hotel Service**: Gestiona información de hoteles y propiedades.
5. **Room Service**: Gestiona tipos de habitaciones, disponibilidad y precios.
6. **Reservation Service**: Gestiona el proceso de reserva, incluido el bloqueo temporal de habitaciones.
7. **Payment Service**: Procesa pagos y gestiona transacciones.
8. **Review Service**: Gestiona reseñas y calificaciones de hoteles.
9. **Notification Service**: Envía notificaciones por email, SMS y en tiempo real.
10. **Report Service**: Genera informes y estadísticas para propietarios de hoteles.

## Requisitos Previos

- Docker y Docker Compose
- Node.js 18 o superior (para desarrollo local)
- npm o yarn (para desarrollo local)

## Configuración

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd reservations-system/backend2
```

2. Configura las variables de entorno (opcional):
   - Crea archivos `.env` en cada carpeta de servicio para personalizar la configuración
   - Las variables predeterminadas están definidas en `docker-compose.yml`

## Ejecución

### Con Docker Compose (recomendado)

1. Construye y ejecuta todos los servicios:
```bash
docker compose up --build
```

2. Accede a los servicios:
   - API Gateway: http://localhost:3000
   - Swagger UI: http://localhost:3000/api/docs
   - phpMyAdmin: http://localhost:8080

### Desarrollo Local

Para desarrollo local de un servicio específico:

1. Instala las dependencias:
```bash
cd backend2
npm install
cd <nombre-del-servicio>
npm install
```

2. Ejecuta el servicio en modo desarrollo:
```bash
npm run start:dev
```

## Documentación

La documentación completa de la API está disponible a través de Swagger UI:
http://localhost:3000/api/docs

## Pruebas

Para ejecutar las pruebas de todos los servicios:
```bash
npm test
```

## Arquitectura

El sistema utiliza una arquitectura de microservicios con los siguientes componentes:

1. **Capa de Entidades**: Modelos de dominio compartidos entre servicios
2. **Capa de Servicios**: Implementación de la lógica de negocio
3. **Capa de Controladores**: Manejo de solicitudes HTTP
4. **Capa de Repositorios**: Acceso a la base de datos

La comunicación entre servicios utiliza TCP con el paquete @nestjs/microservices.

## Patrones de Diseño

- **Repository Pattern**: Para abstraer el acceso a datos
- **Gateway Pattern**: API Gateway como punto de entrada único
- **Circuit Breaker**: Para manejar fallos en la comunicación entre servicios
- **CQRS**: Para operaciones complejas en algunos servicios
- **Event-Driven Architecture**: Para notificaciones y actualizaciones en tiempo real

## Licencia

[MIT](LICENSE)