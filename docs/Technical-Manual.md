# Technical Manual

## Project Overview

This project is a hotel reservation system developed with the following stack:

- **Frontend:** Angular 19 (run locally)
- **Backend:** NestJS
- **Database:** MySQL 8
- **Admin Interface:** phpMyAdmin
- **Deployment Tool:** Docker & Docker Compose

---

## Prerequisites

Make sure the following tools are installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js (v18+)](https://nodejs.org/) (for running the frontend locally)
- [Angular CLI](https://angular.io/cli) (for development)

---

## Deployment Instructions

### 1. Clone the repository

```bash
git clone https://github.com/xSam08/reservations-system
cd reservations-system
```

### 2.1 Start the backend and database (for development)

```bash
docker compose up --build backend db
```

This command will:
- Build and start the **NestJS backend** on port `3000`.
- Launch **MySQL** with the database named `reservations`.
- Launch **phpMyAdmin** on port `8080` for database management.

### 2.2 Start the whole system (for production)

```bash
docker compose up --build
```

This command will:
- Build **Angular** in production mode and expose it on `http://localhost/` without port.
- Build and start the **NestJS backend** on port `3000`.
- Launch **MySQL** with the database named `reservations`.
- Launch **phpMyAdmin** on port `8080` for database management.

### 3. Run the frontend locally (for development)

```bash
cd reservations-frontend
npm install
ng serve
```

The Angular development server will run at `http://localhost:4200/`.

---

## Useful Commands

### Stop all services

```bash
docker compose down
```

### Remove containers, images, and volumes (cleanup)

```bash
docker system prune -a --volumes
```

> ⚠️ This will remove all unused containers, images, and volumes from your system. Use with caution.

---

## Notes

- The frontend is **not** containerized for now to allow faster local development.
- Use `phpMyAdmin` at [http://localhost:8080](http://localhost:8080) to manage the MySQL database.
- Backend API runs at [http://localhost:3000](http://localhost:3000)

---

**Last updated:** April 6, 2025  
**Maintainers:** samuel.osunam@autonoma.edu.co and daniel.giraldov@autonoma.edu.co