# Guía de Referencia - BreazeInTheMoon Reservation System

Este documento sirve como referencia para mantener la consistencia durante el desarrollo del sistema de reservas de hoteles.

## Arquitectura General

El sistema utiliza una arquitectura de microservicios con los siguientes componentes:

1. **API Gateway (Puerto: 3000)** - Punto de entrada único para los clientes
2. **Auth Service (Puerto: 3001)** - Autenticación centralizada y autorización
3. **User Service (Puerto: 3002)** - Gestión de usuarios
4. **Hotel Service (Puerto: 3003)** - Gestión de hoteles
5. **Room Service (Puerto: 3004)** - Gestión de habitaciones
6. **Reservation Service (Puerto: 3005)** - Gestión de reservas
7. **Payment Service (Puerto: 3006)** - Gestión de pagos
8. **Review Service (Puerto: 3007)** - Gestión de reseñas y calificaciones
9. **Notification Service (Puerto: 3008)** - Gestión de notificaciones
10. **Report Service (Puerto: 3009)** - Generación de informes y estadísticas

## Entidades Principales

1. **BaseEntity** - Clase base con id, createdAt, updatedAt
2. **User** - Entidad de usuario con roles (CUSTOMER, HOTEL_ADMIN, SYSTEM_ADMIN)
3. **Hotel** - Entidad de hotel con propiedades, dirección, amenities, etc.
4. **Room** - Entidad de habitación con tipo, capacidad, precio, disponibilidad
5. **Reservation** - Entidad de reserva con fechas, estado, cliente, habitación
6. **Payment** - Entidad de pago asociada a una reserva
7. **Review** - Entidad de reseña asociada a un hotel
8. **Notification** - Entidad de notificación para usuarios
9. **Report** - Entidad de informe para propietarios de hoteles

## Enumeraciones Importantes

```typescript
// UserRole
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  HOTEL_ADMIN = 'HOTEL_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

// RoomType
export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  SUITE = 'SUITE',
  DELUXE = 'DELUXE',
  FAMILY = 'FAMILY'
}

// ReservationStatus
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// NotificationType
export enum NotificationType {
  RESERVATION_CREATED = 'RESERVATION_CREATED',
  RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
  RESERVATION_REJECTED = 'RESERVATION_REJECTED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  RESERVATION_COMPLETED = 'RESERVATION_COMPLETED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  SYSTEM = 'SYSTEM'
}

// ReportType
export enum ReportType {
  OCCUPANCY = 'OCCUPANCY',
  REVENUE = 'REVENUE',
  RESERVATION_ACTIVITY = 'RESERVATION_ACTIVITY'
}
```

## Estructura de Autenticación

- **JWT** para autenticación centralizada
- **Payload de JWT**:
  ```typescript
  export interface JwtPayload {
    sub: string;    // User ID
    email: string;  // User email
    role: UserRole; // User role
  }
  ```
- **Guards de autorización** basados en roles
- **Comunicación entre servicios** utilizando TCP con @nestjs/microservices

## Estructura de Servicios

Cada servicio tiene la siguiente estructura:
```
service-name/
├── src/
│   ├── controllers/       # Controladores REST y microservicios
│   ├── services/          # Lógica de negocio
│   ├── interfaces/        # Interfaces específicas del servicio
│   ├── dto/               # DTOs específicos del servicio
│   ├── main.ts            # Punto de entrada del servicio
│   └── app.module.ts      # Módulo principal de NestJS
├── Dockerfile             # Configuración Docker
├── package.json           # Dependencias
└── tsconfig.json          # Configuración TypeScript
```

## Comandos Importantes

- **Iniciar todos los servicios**: `docker compose up`
- **Iniciar un servicio específico**: `docker compose up <service-name>`
- **Ejecutar migraciones**: `docker compose exec <service-name> npm run migration:run`
- **Ejecutar pruebas**: `docker compose exec <service-name> npm run test`

## Notas y TODOs

- Implementar validadores de DTO para todos los servicios
- Configurar variables de entorno en cada servicio
- Configurar Twilio para notificaciones SMS
- Configurar SMTP para notificaciones por correo electrónico
- Implementar pruebas unitarias y de integración
- Configurar CI/CD para despliegue automático
- Implementar websockets para notificaciones en tiempo real

## Variables de Entorno Requeridas

```
# Base de datos
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin123
DB_DATABASE=reservations

# JWT
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=24h

# Twilio (para SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SMTP (para emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@example.com
```

## Linters y Comandos de Verificación

- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`

## Estructura de Base de Datos

La base de datos sigue el esquema definido en `database.sql` con las siguientes tablas principales:
- users
- hotels
- addresses
- rooms
- reservations
- payments
- reviews
- notifications
- reports

## Políticas de Commits y PR

- Commits descriptivos indicando el servicio afectado
- PR con casos de prueba y descripción de cambios
- Utilizar linters y verificación de tipos antes de enviar PR