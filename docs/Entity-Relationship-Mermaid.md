# Diagrama de Entidad-Relación del Sistema de Reservas

```mermaid
erDiagram
    %% Entidades principales
    
    USERS {
        string user_id PK "UUID"
        string email UK "NOT NULL"
        string password "NOT NULL"
        string name "NOT NULL"
        string phone_number "NULLABLE"
        enum role "CUSTOMER|HOTEL_ADMIN|SYSTEM_ADMIN"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    HOTELS {
        string hotel_id PK "UUID"
        string name "NOT NULL"
        text description "NULLABLE"
        string owner_id FK "NOT NULL"
        float average_rating "DEFAULT 0"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    ADDRESSES {
        string address_id PK "UUID"
        string hotel_id FK "NOT NULL"
        string street "NOT NULL"
        string city "NOT NULL"
        string state "NULLABLE"
        string country "NOT NULL"
        string zip_code "NULLABLE"
    }
    
    HOTEL_AMENITIES {
        string hotel_amenity_id PK "UUID"
        string hotel_id FK "NOT NULL"
        string name "NOT NULL"
    }
    
    HOTEL_PHOTOS {
        string hotel_photo_id PK "UUID"
        string hotel_id FK "NOT NULL"
        string url "NOT NULL"
    }
    
    ROOMS {
        string room_id PK "UUID"
        string hotel_id FK "NOT NULL"
        string room_number "NOT NULL"
        enum room_type "SINGLE|DOUBLE|TWIN|SUITE|DELUXE"
        int capacity "NOT NULL"
        boolean is_available "DEFAULT true"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    ROOM_PRICES {
        string room_price_id PK "UUID"
        string room_id FK "NOT NULL"
        decimal amount "PRECISION(10,2)"
        string currency "DEFAULT USD"
    }
    
    ROOM_AMENITIES {
        string room_amenity_id PK "UUID"
        string room_id FK "NOT NULL"
        string name "NOT NULL"
    }
    
    ROOM_IMAGES {
        string room_image_id PK "UUID"
        string room_id FK "NOT NULL"
        string url "NOT NULL"
    }
    
    ROOM_AVAILABILITY {
        string availability_id PK "UUID"
        string room_id FK "NOT NULL"
        date date "NOT NULL"
        int available_rooms "NOT NULL"
        int total_rooms "NOT NULL"
        decimal base_price "PRECISION(10,2) NULLABLE"
        decimal discounted_price "PRECISION(10,2) NULLABLE"
        enum status "AVAILABLE|LIMITED|UNAVAILABLE"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    RESERVATIONS {
        string reservation_id PK "VARCHAR(36)"
        string customer_id FK "NOT NULL"
        string hotel_id FK "NOT NULL"
        string room_id FK "NOT NULL"
        date check_in_date "NOT NULL"
        date check_out_date "NOT NULL"
        enum status "PENDING|CONFIRMED|CANCELLED|COMPLETED|REJECTED"
        int guest_count "NOT NULL"
        decimal total_amount "PRECISION(10,2) NULLABLE"
        string currency "DEFAULT USD"
        text special_requests "NULLABLE"
        text cancellation_reason "NULLABLE"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    PAYMENTS {
        string payment_id PK "UUID"
        string reservation_id FK "NOT NULL"
        decimal amount "PRECISION(10,2)"
        string currency "DEFAULT USD"
        enum status "PENDING|COMPLETED|FAILED|REFUNDED"
        enum method "CREDIT_CARD|DEBIT_CARD|PAYPAL|BANK_TRANSFER"
        string transaction_id "NULLABLE"
        datetime payment_date "NOT NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    REVIEWS {
        string review_id PK "UUID"
        string customer_id FK "NOT NULL"
        string hotel_id FK "NOT NULL"
        string reservation_id FK "NULLABLE"
        int rating "1-5"
        text content "NULLABLE"
        json images "ARRAY"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    NOTIFICATIONS {
        string notification_id PK "UUID"
        string user_id FK "NOT NULL"
        enum type "RESERVATION|PAYMENT|REVIEW|SYSTEM"
        string message "NOT NULL"
        boolean is_read "DEFAULT false"
        json data "NULLABLE"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    
    %% Relaciones
    
    %% Usuario propietario de hoteles
    USERS ||--o{ HOTELS : "owns"
    
    %% Hotel y su dirección (1:1)
    HOTELS ||--|| ADDRESSES : "has"
    
    %% Hotel y sus amenidades (1:N)
    HOTELS ||--o{ HOTEL_AMENITIES : "has"
    
    %% Hotel y sus fotos (1:N)
    HOTELS ||--o{ HOTEL_PHOTOS : "has"
    
    %% Hotel y sus habitaciones (1:N)
    HOTELS ||--o{ ROOMS : "contains"
    
    %% Habitación y su precio (1:1)
    ROOMS ||--|| ROOM_PRICES : "has"
    
    %% Habitación y sus amenidades (1:N)
    ROOMS ||--o{ ROOM_AMENITIES : "has"
    
    %% Habitación y sus imágenes (1:N)
    ROOMS ||--o{ ROOM_IMAGES : "has"
    
    %% Habitación y su disponibilidad (1:N)
    ROOMS ||--o{ ROOM_AVAILABILITY : "tracks"
    
    %% Usuario cliente y sus reservas (1:N)
    USERS ||--o{ RESERVATIONS : "makes"
    
    %% Hotel y sus reservas (1:N)
    HOTELS ||--o{ RESERVATIONS : "receives"
    
    %% Habitación y sus reservas (1:N)
    ROOMS ||--o{ RESERVATIONS : "booked_in"
    
    %% Reserva y sus pagos (1:N)
    RESERVATIONS ||--o{ PAYMENTS : "has"
    
    %% Usuario y sus reseñas (1:N)
    USERS ||--o{ REVIEWS : "writes"
    
    %% Hotel y sus reseñas (1:N)
    HOTELS ||--o{ REVIEWS : "receives"
    
    %% Reserva y su reseña (1:1) - opcional
    RESERVATIONS ||--o| REVIEWS : "may_have"
    
    %% Usuario y sus notificaciones (1:N)
    USERS ||--o{ NOTIFICATIONS : "receives"
```

## Descripción del Diagrama

### Entidades Principales

1. **USERS**: Usuarios del sistema (clientes, administradores de hotel, administradores del sistema)
2. **HOTELS**: Hoteles registrados en el sistema
3. **ROOMS**: Habitaciones de cada hotel
4. **RESERVATIONS**: Reservas realizadas por los clientes
5. **PAYMENTS**: Pagos asociados a las reservas
6. **REVIEWS**: Reseñas escritas por los clientes
7. **NOTIFICATIONS**: Notificaciones enviadas a los usuarios

### Entidades de Soporte

1. **ADDRESSES**: Direcciones de los hoteles
2. **HOTEL_AMENITIES**: Amenidades de los hoteles
3. **HOTEL_PHOTOS**: Fotos de los hoteles
4. **ROOM_PRICES**: Precios de las habitaciones
5. **ROOM_AMENITIES**: Amenidades de las habitaciones
6. **ROOM_IMAGES**: Imágenes de las habitaciones
7. **ROOM_AVAILABILITY**: Disponibilidad de habitaciones por fecha

### Relaciones Principales

- **Un usuario** puede ser propietario de **múltiples hoteles**
- **Un hotel** tiene **una dirección**, **múltiples amenidades**, **múltiples fotos** y **múltiples habitaciones**
- **Una habitación** tiene **un precio**, **múltiples amenidades**, **múltiples imágenes** y **múltiple disponibilidad por fecha**
- **Un usuario** puede hacer **múltiples reservas**
- **Una reserva** puede tener **múltiples pagos** y **una reseña opcional**
- **Un usuario** puede escribir **múltiples reseñas** y recibir **múltiples notificaciones**

### Cardinalidades

- `||--||`: Relación uno a uno
- `||--o{`: Relación uno a muchos
- `||--o|`: Relación uno a uno opcional

### Tipos de Datos

- **UUID**: Identificadores únicos universales
- **VARCHAR**: Cadenas de texto con longitud específica
- **TEXT**: Texto largo
- **DECIMAL**: Números decimales con precisión específica
- **INT**: Números enteros
- **BOOLEAN**: Valores verdadero/falso
- **DATE**: Fechas
- **DATETIME**: Fecha y hora
- **ENUM**: Valores enumerados
- **JSON**: Datos en formato JSON

### Índices y Constraints

- **PK**: Clave primaria
- **FK**: Clave foránea
- **UK**: Clave única
- **INDEX**: Índice para optimizar consultas (especialmente en ROOM_AVAILABILITY)