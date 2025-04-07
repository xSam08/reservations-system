# 🏗️ Arquitectura y Diseño del Sistema BreazeInTheMoon

Este documento explica la arquitectura, patrones de diseño y diagramas utilizados en el sistema de reservas de hoteles BreazeInTheMoon.

## 📋 Contenido

- [Patrones de Diseño](#patrones-de-diseño)
- [Diagrama de Clases](#diagrama-de-clases)
- [Diagrama Entidad-Relación](#diagrama-entidad-relación)

## 🔩 Patrones de Diseño

En el desarrollo del sistema BreazeInTheMoon, hemos adoptado varios patrones de diseño clave para garantizar una arquitectura robusta, mantenible y escalable:

### 1. Arquitectura de Microservicios

**Justificación**: Elegimos una arquitectura de microservicios para permitir el desarrollo independiente de componentes, facilitar la escalabilidad horizontal y mejorar la resiliencia del sistema. Esto nos permite desplegar y actualizar servicios individuales sin afectar todo el sistema.

**Beneficios**:
- Desarrollo paralelo por equipos independientes
- Escalabilidad selectiva de servicios específicos
- Mayor tolerancia a fallos
- Facilita la integración continua y despliegue continuo (CI/CD)

### 2. Patrón MVC (Modelo-Vista-Controlador)

**Justificación**: Implementamos MVC para separar claramente las responsabilidades entre la lógica de negocio, la presentación y el control del flujo de la aplicación.

**Beneficios**:
- Separación de preocupaciones
- Facilita las pruebas unitarias
- Promueve la reutilización de código
- Mejora la mantenibilidad

### 3. Patrón Repositorio

**Justificación**: Utilizamos este patrón para abstraer la lógica de acceso a datos y proporcionar una API consistente para la persistencia de objetos.

**Beneficios**:
- Desacopla la lógica de negocio del acceso a datos
- Facilita el cambio de implementación de almacenamiento
- Mejora la testabilidad al permitir mock repositories en pruebas

### 4. Patrón DTO (Data Transfer Object)

**Justificación**: Empleamos DTOs para transferir datos entre subsistemas, especialmente en la comunicación entre el frontend y el backend.

**Beneficios**:
- Optimización de transferencia de datos en la red
- Desacoplamiento entre capas
- Control sobre qué datos se exponen a través de APIs

### 5. Patrón Observer (para notificaciones)

**Justificación**: Implementamos el patrón Observer para el sistema de notificaciones en tiempo real.

**Beneficios**:
- Comunicación desacoplada entre componentes
- Actualización en tiempo real de la interfaz de usuario
- Extensibilidad para diferentes tipos de notificaciones

## 📊 Diagrama de Clases

![Diagrama de Clases](diagrams/ClassDiagram.svg)

El diagrama de clases de BreazeInTheMoon está estructurado en tres capas principales:

### 1. Modelo del Dominio (Entidades)

Esta capa representa las entidades fundamentales del sistema y sus relaciones:

- **BaseEntity**: Clase base que proporciona atributos comunes como id, createdAt y updatedAt.
- **Entidades principales**: User, Hotel, Room, Reservation, Payment, Review, Notification, Report.
- **Enumeraciones**: UserRole, RoomType, ReservationStatus, NotificationType, ReportType.
- **Value Objects**: Address, Money.

Las entidades del dominio son independientes de la implementación técnica y representan el modelo conceptual del sistema.

### 2. Capa de Servicios y Controladores (Backend)

Implementa la lógica de negocio y expone APIs:

- **Servicios**: Encapsulan la lógica de negocio (AuthService, UserService, HotelService, etc.).
- **Controladores**: Gestionan las peticiones HTTP y delegan en los servicios (AuthController, UserController, etc.).

### 3. Componentes de Interfaz de Usuario (Frontend)

Implementa la interfaz de usuario en Angular:

- **Componentes principales**: HotelListComponent, HotelDetailComponent, ReservationFormComponent, etc.
- **Dashboards**: CustomerDashboardComponent, HotelAdminDashboardComponent.

### ¿Por qué está separado en estas capas?

Esta separación refleja la arquitectura de microservicios y MVC solicitada, donde:

1. **El modelo de dominio** define las entidades compartidas entre frontend y backend.
2. **El backend** implementa la lógica de negocio y APIs en NestJS.
3. **El frontend** implementa la interfaz de usuario en Angular.

Esta división facilita:
- El desarrollo independiente de cada capa
- La reutilización de código
- La escalabilidad horizontal de servicios específicos
- La testabilidad de componentes aislados

## 📝 Diagrama Entidad-Relación

![Diagrama Entidad-Relación](diagrams/Entity-RelationshipDiagram.drawio)

El diagrama entidad-relación muestra la estructura de la base de datos del sistema BreazeInTheMoon, siguiendo las mejores prácticas de nomenclatura para facilitar el mantenimiento y la comprensión.

### Convención de Nomenclatura

Para mejorar la claridad y reducir ambigüedades, utilizamos la siguiente convención para nombres de campos:

- **Claves primarias**: `tabla_id` (ej: `user_id`, `hotel_id`, `room_id`)
- **Claves foráneas**: `tabla_campo` (ej: `hotel_id` en la tabla `rooms`)
- **Campos de tiempo**: `created_at`, `updated_at`
- **Campos booleanos**: prefijo `is_` o `has_` (ej: `is_available`, `has_balcony`)

### Entidades Principales

- **Users**
  * `user_id`: Identificador único del usuario
  * `email`: Correo electrónico (único)
  * `password`: Contraseña encriptada
  * `name`: Nombre completo
  * `phone_number`: Número telefónico
  * `role`: Rol del usuario (CUSTOMER, HOTEL_ADMIN, SYSTEM_ADMIN)
  * `created_at`, `updated_at`: Marcas de tiempo

- **Hotels**
  * `hotel_id`: Identificador único del hotel
  * `owner_id`: ID del administrador del hotel (FK → users.user_id)
  * `name`: Nombre del hotel
  * `description`: Descripción detallada
  * Campos de dirección: `street`, `city`, `state`, `country`, `zip_code`
  * `average_rating`: Calificación promedio
  * `created_at`, `updated_at`: Marcas de tiempo

- **Rooms**
  * `room_id`: Identificador único de la habitación
  * `hotel_id`: ID del hotel al que pertenece (FK → hotels.hotel_id)
  * `room_number`: Número de habitación
  * `room_type`: Tipo de habitación (SINGLE, DOUBLE, SUITE, etc.)
  * `capacity`: Capacidad máxima
  * `price_amount`: Precio de la habitación
  * `price_currency`: Moneda del precio
  * `is_available`: Indicador de disponibilidad
  * `created_at`, `updated_at`: Marcas de tiempo

- **Reservations**
  * `reservation_id`: Identificador único de la reserva
  * `customer_id`: ID del cliente (FK → users.user_id)
  * `hotel_id`: ID del hotel (FK → hotels.hotel_id)
  * `room_id`: ID de la habitación (FK → rooms.room_id)
  * `check_in_date`: Fecha de entrada
  * `check_out_date`: Fecha de salida
  * `reservation_status`: Estado (PENDING, CONFIRMED, REJECTED, etc.)
  * `total_price_amount`: Precio total
  * `total_price_currency`: Moneda del precio
  * `guest_count`: Número de huéspedes
  * `created_at`, `updated_at`: Marcas de tiempo

- **Payments**
  * `payment_id`: Identificador único del pago
  * `reservation_id`: ID de la reserva (FK → reservations.reservation_id)
  * `amount`: Monto del pago
  * `currency`: Moneda del pago
  * `payment_status`: Estado del pago
  * `payment_method`: Método de pago
  * `transaction_id`: ID de la transacción externa
  * `payment_date`: Fecha del pago
  * `created_at`, `updated_at`: Marcas de tiempo

- **Reviews**
  * `review_id`: Identificador único de la reseña
  * `customer_id`: ID del cliente (FK → users.user_id)
  * `hotel_id`: ID del hotel (FK → hotels.hotel_id)
  * `reservation_id`: ID de la reserva (FK → reservations.reservation_id)
  * `rating`: Calificación (1-5)
  * `content`: Contenido de la reseña
  * `created_at`, `updated_at`: Marcas de tiempo

- **Notifications**
  * `notification_id`: Identificador único de la notificación
  * `user_id`: ID del usuario destinatario (FK → users.user_id)
  * `notification_type`: Tipo de notificación
  * `message`: Contenido de la notificación
  * `is_read`: Indicador de lectura
  * `created_at`: Marca de tiempo de creación

### Relaciones Clave

- Un usuario (`users.user_id`) con rol HOTEL_ADMIN puede administrar muchos hoteles (`hotels.owner_id`)
- Un hotel (`hotels.hotel_id`) contiene muchas habitaciones (`rooms.hotel_id`)
- Un cliente (`users.user_id` con rol CUSTOMER) puede hacer muchas reservas (`reservations.customer_id`)
- Una habitación (`rooms.room_id`) puede estar asociada a muchas reservas (`reservations.room_id`) en diferentes fechas
- Una reserva (`reservations.reservation_id`) puede tener un pago asociado (`payments.reservation_id`)
- Un cliente (`users.user_id`) puede escribir muchas reseñas (`reviews.customer_id`)
- Un hotel (`hotels.hotel_id`) puede tener muchas reseñas (`reviews.hotel_id`)

### Diseño de Base de Datos

El diseño de la base de datos refleja fielmente el modelo de dominio, asegurando:

1. **Integridad referencial** mediante el uso de claves foráneas claramente nombradas
2. **Normalización** para minimizar la redundancia de datos
3. **Índices** estratégicos para optimizar consultas frecuentes
4. **Tipos de datos** adecuados para cada atributo
5. **Convenciones de nomenclatura** consistentes para facilitar mantenimiento

La implementación física utiliza MySQL como sistema de gestión de base de datos relacional, aprovechando sus características de integridad, transacciones y escalabilidad para un sistema de reservas robusto.

## 🔄 Diagramas de Secuencia

Los siguientes diagramas de secuencia ilustran los flujos principales del sistema:

### 1. Proceso de Reserva

![Proceso de Reserva](diagrams/ReservationSequence.svg)

Este diagrama muestra el flujo completo del proceso de reserva, desde la búsqueda inicial de hoteles, la selección de habitación, el proceso de pago, hasta la confirmación final y notificaciones.

### 2. Proceso de Cancelación

![Proceso de Cancelación](diagrams/CancellationSequence.svg)

Este diagrama ilustra el flujo de cancelación de una reserva, incluyendo las diferentes políticas de cancelación, posibles reembolsos y notificaciones a todas las partes interesadas.