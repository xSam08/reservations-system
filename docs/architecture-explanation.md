# Architecture and System Design for BreazeInTheMoon

This document explains the architecture, design patterns, and diagrams used in the BreazeInTheMoon hotel reservation system.

## Table of Contents

- [Design Patterns](#design-patterns)
- [Class Diagram](#class-diagram)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Sequence Diagrams](#sequence-diagrams)

## Design Patterns

In the development of the BreazeInTheMoon system, we have adopted several key design patterns to ensure a robust, maintainable, and scalable architecture:

### 1. Microservices Architecture

**Justification**: We chose a microservices architecture to enable independent component development, facilitate horizontal scalability, and improve system resilience. This allows us to deploy and update individual services without affecting the entire system.

**Benefits**:
- Parallel development by independent teams
- Selective scalability of specific services
- Enhanced fault tolerance
- Facilitates continuous integration and continuous deployment (CI/CD)

### 2. MVC Pattern (Model-View-Controller)

**Justification**: We implemented MVC to clearly separate responsibilities between business logic, presentation, and application flow control.

**Benefits**:
- Separation of concerns
- Facilitates unit testing
- Promotes code reuse
- Improves maintainability

### 3. Repository Pattern

**Justification**: We utilize this pattern to abstract data access logic and provide a consistent API for object persistence.

**Benefits**:
- Decouples business logic from data access
- Facilitates storage implementation changes
- Improves testability by allowing mock repositories in tests

### 4. DTO Pattern (Data Transfer Object)

**Justification**: We employ DTOs to transfer data between subsystems, especially in frontend-backend communication.

**Benefits**:
- Network data transfer optimization
- Layer decoupling
- Control over data exposed through APIs

### 5. Observer Pattern (for notifications)

**Justification**: We implemented the Observer pattern for the real-time notification system.

**Benefits**:
- Decoupled communication between components
- Real-time user interface updates
- Extensibility for different notification types

## Class Diagram

![Class Diagram](UML/ClassDiagram.svg)

The BreazeInTheMoon class diagram is structured in three main layers:

### 1. Domain Model (Entities)

This layer represents the fundamental system entities and their relationships:

- **BaseEntity**: Base class providing common attributes such as id, createdAt, and updatedAt.
- **Primary Entities**: User, Hotel, Room, Reservation, Payment, Review, Notification, Report.
- **Enumerations**: UserRole, RoomType, ReservationStatus, NotificationType, ReportType.
- **Value Objects**: Address, Money.

Domain entities are independent of technical implementation and represent the system's conceptual model.

### 2. Services and Controllers Layer (Backend)

Implements business logic and exposes APIs:

- **Services**: Encapsulate business logic (AuthService, UserService, HotelService, etc.).
- **Controllers**: Handle HTTP requests and delegate to services (AuthController, UserController, etc.).

### 3. User Interface Components (Frontend)

Implements the user interface in Angular:

- **Main Components**: HotelListComponent, HotelDetailComponent, ReservationFormComponent, etc.
- **Dashboards**: CustomerDashboardComponent, HotelAdminDashboardComponent.

### Layer Separation Rationale

This separation reflects the requested microservices and MVC architecture, where:

1. **Domain model** defines entities shared between frontend and backend.
2. **Backend** implements business logic and APIs in NestJS.
3. **Frontend** implements the user interface in Angular.

This division facilitates:
- Independent development of each layer
- Code reuse
- Horizontal scalability of specific services
- Isolated component testing

## Entity-Relationship Diagram

![Entity-Relationship Diagram](UML/Entity-RelationshipDiagram.svg)

The entity-relationship diagram shows the database structure of the BreazeInTheMoon system, following best practices for nomenclature to facilitate maintenance and understanding.

### Naming Convention

To improve clarity and reduce ambiguities, we use the following convention for field names:

- **Primary keys**: `table_id` (e.g., `user_id`, `hotel_id`, `room_id`)
- **Foreign keys**: `table_field` (e.g., `hotel_id` in the `rooms` table)
- **Timestamp fields**: `created_at`, `updated_at`
- **Boolean fields**: prefix `is_` or `has_` (e.g., `is_available`, `has_balcony`)

### Primary Entities

- **Users**
  * `user_id`: Unique user identifier
  * `email`: Email address (unique)
  * `password`: Encrypted password
  * `name`: Full name
  * `phone_number`: Phone number
  * `role`: User role (CUSTOMER, HOTEL_ADMIN, SYSTEM_ADMIN)
  * `created_at`, `updated_at`: Timestamps

- **Hotels**
  * `hotel_id`: Unique hotel identifier
  * `owner_id`: Hotel administrator ID (FK → users.user_id)
  * `name`: Hotel name
  * `description`: Detailed description
  * Address fields: `street`, `city`, `state`, `country`, `zip_code`
  * `average_rating`: Average rating
  * `created_at`, `updated_at`: Timestamps

- **Rooms**
  * `room_id`: Unique room identifier
  * `hotel_id`: ID of the hotel to which it belongs (FK → hotels.hotel_id)
  * `room_number`: Room number
  * `room_type`: Room type (SINGLE, DOUBLE, SUITE, etc.)
  * `capacity`: Maximum capacity
  * `price_amount`: Room price
  * `price_currency`: Price currency
  * `is_available`: Availability indicator
  * `created_at`, `updated_at`: Timestamps

- **Reservations**
  * `reservation_id`: Unique reservation identifier
  * `customer_id`: Customer ID (FK → users.user_id)
  * `hotel_id`: Hotel ID (FK → hotels.hotel_id)
  * `room_id`: Room ID (FK → rooms.room_id)
  * `check_in_date`: Check-in date
  * `check_out_date`: Check-out date
  * `reservation_status`: Status (PENDING, CONFIRMED, REJECTED, etc.)
  * `total_price_amount`: Total price
  * `total_price_currency`: Price currency
  * `guest_count`: Number of guests
  * `created_at`, `updated_at`: Timestamps

- **Payments**
  * `payment_id`: Unique payment identifier
  * `reservation_id`: Reservation ID (FK → reservations.reservation_id)
  * `amount`: Payment amount
  * `currency`: Payment currency
  * `payment_status`: Payment status
  * `payment_method`: Payment method
  * `transaction_id`: External transaction ID
  * `payment_date`: Payment date
  * `created_at`, `updated_at`: Timestamps

- **Reviews**
  * `review_id`: Unique review identifier
  * `customer_id`: Customer ID (FK → users.user_id)
  * `hotel_id`: Hotel ID (FK → hotels.hotel_id)
  * `reservation_id`: Reservation ID (FK → reservations.reservation_id)
  * `rating`: Rating (1-5)
  * `content`: Review content
  * `created_at`, `updated_at`: Timestamps

- **Notifications**
  * `notification_id`: Unique notification identifier
  * `user_id`: Recipient user ID (FK → users.user_id)
  * `notification_type`: Notification type
  * `message`: Notification content
  * `is_read`: Read indicator
  * `created_at`: Creation timestamp

### Key Relationships

- A user (`users.user_id`) with HOTEL_ADMIN role can manage many hotels (`hotels.owner_id`)
- A hotel (`hotels.hotel_id`) contains many rooms (`rooms.hotel_id`)
- A customer (`users.user_id` with CUSTOMER role) can make many reservations (`reservations.customer_id`)
- A room (`rooms.room_id`) can be associated with many reservations (`reservations.room_id`) on different dates
- A reservation (`reservations.reservation_id`) can have an associated payment (`payments.reservation_id`)
- A customer (`users.user_id`) can write many reviews (`reviews.customer_id`)
- A hotel (`hotels.hotel_id`) can have many reviews (`reviews.hotel_id`)

### Database Design

The database design faithfully reflects the domain model, ensuring:

1. **Referential integrity** through clearly named foreign keys
2. **Normalization** to minimize data redundancy
3. Strategic **indexing** to optimize frequent queries
4. Appropriate **data types** for each attribute
5. Consistent **naming conventions** to facilitate maintenance

The physical implementation uses MySQL as a relational database management system, leveraging its integrity, transaction, and scalability features for a robust reservation system.

## Sequence Diagrams

The following sequence diagrams illustrate the main system flows:

### 1. Reservation Process

![Reservation Process](UML/ReservationSequence.svg)

This diagram shows the complete flow of the reservation process, from the initial hotel search, room selection, payment process, to final confirmation and notifications.

### 2. Cancellation Process

![Cancellation Process](UML/CancellationSequence.svg)

This diagram illustrates the flow of reservation cancellation, including the different cancellation policies, possible refunds, and notifications to all interested parties.
