# Software Requirements Specification (SRS)

## 1. General Description

This document outlines the functional and non-functional requirements for the hotel reservation system developed using Angular, NestJS, and MySQL. The goal of the system is to facilitate efficient management of room bookings by both customers and administrators. The frontend will be developed locally, while the backend and database are fully containerized using Docker for scalability and ease of deployment.

---

## 2. Functional Requirements

### 2.1 User Management
- FR-01: The system must allow user registration with roles (customer, administrator).
- FR-02: The system must allow users to log in with valid credentials.
- FR-03: The system must validate user roles to authorize or restrict access to specific features.

### 2.2 Room Management
- FR-04: Administrators must be able to create, update, and delete rooms.
- FR-05: Each room must have attributes such as number, type, capacity, availability, and price.

### 2.3 Reservation Management
- FR-06: Customers must be able to make reservations by selecting room, check-in, and check-out dates.
- FR-07: The system must validate room availability before confirming a reservation.
- FR-08: Customers must be able to view and cancel their own reservations.
- FR-09: Administrators must be able to view all reservations in the system.

### 2.4 Reporting
- FR-10: The system must allow administrators to generate reports based on date, room, or user filters.

---

## 3. Non-Functional Requirements

### 3.1 Performance
- NFR-01: The system should respond to user requests within 2 seconds.

### 3.2 Security
- NFR-02: Passwords must be securely stored using hashing.
- NFR-03: The backend routes must be protected using JWT-based authentication.

### 3.3 Usability
- NFR-04: The user interface must be intuitive and accessible to non-technical users.

### 3.4 Scalability
- NFR-05: The system must be designed to easily accommodate new features without affecting performance.

### 3.5 Maintainability
- NFR-06: The codebase must follow best practices and be well-documented for future modifications.

---

## 4. Client-Specific Requirements

- CR-01: The frontend should be developed and run locally for flexibility during development.
- CR-02: Only the backend and the database should be containerized during the development phase.
- CR-03: The database must use MySQL, and phpMyAdmin must be exposed for database administration.
- CR-04: The system must support quick deployment via a single `docker compose up --build` command.

---

## 5. Technology Stack

- **Frontend:** Angular 19 (running locally)
- **Backend:** NestJS (Node.js)
- **Database:** MySQL 8
- **Database Admin Panel:** phpMyAdmin
- **Containers:** Docker & Docker Compose
- **Main Programming Language:** TypeScript

---

## 6. Assumptions and Dependencies

- The system is expected to run in a local network environment during development.
- Users are expected to access the system using modern web browsers compatible with Angular.
- Docker and Docker Compose must be installed on the machine running the backend and database.
- A `docker-compose.yml` file will be provided with all necessary configurations for deployment.

---

**Last updated:** April 6, 2025  
**Authors:** samuel.osunam@autonoma.edu.co and daniel.giraldov@autonoma.edu.co