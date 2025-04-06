# 🌙 BreazeInTheMoon - Hotel Reservation System

**BreazeInTheMoon** is a hotel reservation system built using a modern **microservices architecture**, designed to deliver a smooth and accessible experience for both hotel administrators and customers. The entire platform is containerized with Docker for easy deployment and scalability across different environments.

## 🛠️ Technologies Used

- **Frontend:** Angular  
- **Backend:** NestJS  
- **Database:** MySQL  
- **API Docs:** Swagger  
- **Containerization:** Docker & Docker Compose  
- **Admin Tool:** phpMyAdmin  

## 📦 Project Structure

```
reservations-system/
│
├── docker-compose.yml           # Docker composition for the whole system
├── .gitignore                   # Unified gitignore for backend and frontend
├── README.md                    # Project documentation
│
├── docs/                        # Software engineering documentation
│   ├── SRS.md                   # Software Requirements Specification
│   ├── UML/                     # UML diagrams (class, sequence, component)
│   ├── ERD.png                  # Entity-Relationship Diagram
│   ├── Technical-Manual.md      # System architecture and setup
│   └── User-Manual.md           # User guide with examples and screenshots
│
├── reservations-frontend/      # Angular frontend application
│   ├── src/                     # Source code
│   ├── angular.json             # Angular configuration
│   └── Dockerfile               # Dockerfile for frontend
│
└── reservations-backend/       # NestJS backend API
    ├── src/                     # Source code
    ├── swagger/                 # Swagger API docs
    ├── test/                    # Unit tests
    └── Dockerfile               # Dockerfile for backend
```

## 💡 Features Overview

### 👤 Customers

- Advanced hotel search with filters by **location**, **price**, **room type**, and **availability**.  
- Intuitive and fast **reservation process** with visual confirmation.  
- Access to **past and current reservations** with status updates.  
- Real-time **notifications** for reservation confirmation or rejection.  
- Ability to **rate and review** hotel stays, visible to other users.  

### 🏨 Hotel Administration

- Dashboard to manage hotel info and **add/edit rooms** (price, capacity, type, availability).  
- View and **manage reservations** with one-click acceptance/rejection.  
- Access to **reservation history**, **reports**, and **room occupancy statistics**.  
- Receive **real-time notifications** for new bookings.  
- View and respond to **customer reviews and ratings**.  

## 🔐 Security & Architecture

- Built with **modular design principles** in NestJS for scalability and maintainability.  
- Role-based access control to ensure only authorized users can access specific features.  
- Real-time availability blocking to **prevent overbookings** and conflicts.  
- **Email integration** for automated customer communication.  
- All APIs are documented using **Swagger** for easy testing and integration.  

## 📃 Software Engineering Documentation

All system development is accompanied by detailed software engineering documentation located in the `docs/` folder:

- **Software Requirements Specification (SRS)**  
- **UML Diagrams**
  - Class Diagram  
  - Sequence Diagram  
  - Component Diagram  
- **Entity-Relationship Model (ERM)**  
- **Technical Manual**  
- **User Manual**  
- **Unit Tests**
  - Coverage ≥ 85% for all critical components  


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/xSam08/reservations-system
cd reservations-system
```

### 2. Start the system using Docker

```bash
docker-compose up --build
```

- **Frontend:**    [http://localhost:4200](http://localhost:4200)  
- **Backend API:** [http://localhost:3000](http://localhost:3000)  
- **phpMyAdmin:**  [http://localhost:8080](http://localhost:8080)  
  - User: `root`  
  - Password: `pending...`

## 🧪 Testing

Unit tests can be executed using:

### Frontend (Angular)

```bash
cd reservations-frontend
ng test
```

### Backend (NestJS)

```bash
cd reservations-backend
npm run test
```

## 📬 Contact

For any inquiries or technical support, please contact the development team at:

**Dev Team**  
📧 daniel.giraldov@autonoma.edu.co and samuel.osunam@autonoma.edu.co