# Diagrama de Clases del Backend - Sistema de Reservas

```mermaid
classDiagram
    %% ======================================
    %% API GATEWAY
    %% ======================================
    class APIGateway {
        +routeRequest(path: string, method: string): Response
        +authenticate(token: string): boolean
        +rateLimit(ip: string): boolean
    }

    %% ======================================
    %% AUTH SERVICE
    %% ======================================
    class AuthController {
        -authService: AuthService
        +register(createUserDto): Promise~ApiResponse~
        +login(loginDto): Promise~ApiResponse~
        +getProfile(userId: string): Promise~ApiResponse~
        +logout(userId: string): Promise~ApiResponse~
        +refreshToken(refreshTokenDto): Promise~ApiResponse~
        +forgotPassword(forgotPasswordDto): Promise~ApiResponse~
        +resetPassword(resetPasswordDto): Promise~ApiResponse~
        +verifyEmail(verifyEmailDto): Promise~ApiResponse~
        +validateToken(token: string): Promise~ApiResponse~
    }

    class AuthService {
        -userRepository: Repository~User~
        -jwtService: JwtService
        +register(createUserDto): Promise~UserResponse~
        +login(user: User): Promise~LoginResponse~
        +validateUser(email: string, password: string): Promise~User~
        +getProfile(userId: string): Promise~UserResponseDto~
        +generateToken(user: User): Promise~string~
        +refreshToken(refreshTokenDto): Promise~TokenResponse~
        +forgotPassword(forgotPasswordDto): Promise~MessageResponse~
        +resetPassword(resetPasswordDto): Promise~MessageResponse~
        +verifyEmail(verifyEmailDto): Promise~MessageResponse~
    }

    %% ======================================
    %% HOTEL SERVICE (includes rooms)
    %% ======================================
    class HotelsController {
        -hotelsService: HotelsService
        +create(createHotelDto, userId: string): Promise~ApiResponse~
        +findAll(): Promise~ApiResponse~
        +search(query: string): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +update(id: string, updateDto, userId: string): Promise~ApiResponse~
        +remove(id: string, userId: string): Promise~ApiResponse~
        +getHotelRooms(hotelId: string): Promise~ApiResponse~
        +getHotelReservations(hotelId: string): Promise~ApiResponse~
        +getHotelStatistics(hotelId: string): Promise~ApiResponse~
    }

    class HotelsService {
        -hotelRepository: Repository~Hotel~
        -roomRepository: Repository~Room~
        -availabilityServiceUrl: string
        +create(createHotelDto, ownerId: string): Promise~HotelResponseDto~
        +findAll(): Promise~HotelResponseDto[]~
        +search(query: string): Promise~HotelResponseDto[]~
        +findOne(id: string): Promise~HotelResponseDto~
        +update(id: string, updateDto, userId: string): Promise~HotelResponseDto~
        +remove(id: string, userId: string): Promise~void~
        +createRoom(hotelId: string, createRoomDto): Promise~RoomResponseDto~
        +getHotelRooms(hotelId: string): Promise~RoomResponseDto[]~
        +updateRoom(roomId: string, updateDto): Promise~RoomResponseDto~
        +deleteRoom(roomId: string): Promise~void~
        +getRoomAvailability(roomId: string, checkInDate: Date, checkOutDate: Date): Promise~AvailabilityStatus~
        +getAvailableRooms(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise~RoomResponseDto[]~
        +searchAvailableRooms(searchParams): Promise~PaginatedResponse~RoomResponseDto~~
    }

    %% ======================================
    %% RESERVATION SERVICE
    %% ======================================
    class ReservationController {
        -reservationService: ReservationService
        +create(createReservationDto): Promise~ApiResponse~
        +findAll(): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +updateStatus(id: string, statusDto): Promise~ApiResponse~
        +cancel(id: string, cancelDto): Promise~ApiResponse~
        +getUserReservations(userId: string): Promise~ApiResponse~
        +confirmReservation(id: string): Promise~ApiResponse~
    }

    class ReservationService {
        -reservationRepository: Repository~Reservation~
        -availabilityServiceUrl: string
        +create(createReservationDto, userId: string): Promise~ReservationResponseDto~
        +findAll(): Promise~ReservationResponseDto[]~
        +findOne(id: string): Promise~ReservationResponseDto~
        +updateStatus(id: string, status, userId: string): Promise~ReservationResponseDto~
        +cancel(id: string, reason: string, userId: string): Promise~ReservationResponseDto~
        +getUserReservations(userId: string): Promise~ReservationResponseDto[]~
        +confirmReservation(id: string): Promise~ReservationResponseDto~
        -updateAvailabilityForReservation(roomId: string, checkInDate: Date, checkOutDate: Date, action: string): Promise~void~
    }

    %% ======================================
    %% PAYMENT SERVICE
    %% ======================================
    class PaymentController {
        -paymentService: PaymentService
        +createPayment(createPaymentDto): Promise~ApiResponse~
        +processPayment(processPaymentDto): Promise~ApiResponse~
        +getPaymentHistory(userId: string): Promise~ApiResponse~
        +refundPayment(id: string, refundDto): Promise~ApiResponse~
        +validateCard(cardDto): Promise~ApiResponse~
    }

    class PaymentService {
        +createPayment(createPaymentDto, userId: string): Promise~PaymentResponseDto~
        +processPayment(processPaymentDto, userId: string): Promise~PaymentResponseDto~
        +getPaymentHistory(userId: string): Promise~PaymentResponseDto[]~
        +refundPayment(id: string, refundDto): Promise~PaymentResponseDto~
        +validateCard(cardDto): Promise~boolean~
        +processCardPayment(paymentData): Promise~PaymentResult~
        +processPayPalPayment(paymentData): Promise~PaymentResult~
    }

    %% ======================================
    %% REVIEW SERVICE
    %% ======================================
    class ReviewController {
        -reviewService: ReviewService
        +create(createReviewDto): Promise~ApiResponse~
        +findAll(): Promise~ApiResponse~
        +getHotelReviews(hotelId: string): Promise~ApiResponse~
        +getUserReviews(userId: string): Promise~ApiResponse~
        +getHotelStats(hotelId: string): Promise~ApiResponse~
        +update(id: string, updateDto): Promise~ApiResponse~
        +remove(id: string): Promise~ApiResponse~
    }

    class ReviewService {
        +create(createReviewDto, userId: string): Promise~ReviewResponseDto~
        +findAll(): Promise~ReviewResponseDto[]~
        +getHotelReviews(hotelId: string): Promise~ReviewResponseDto[]~
        +getUserReviews(userId: string): Promise~ReviewResponseDto[]~
        +getHotelStats(hotelId: string): Promise~HotelReviewStats~
        +update(id: string, updateDto): Promise~ReviewResponseDto~
        +remove(id: string): Promise~void~
    }

    %% ======================================
    %% USER SERVICE
    %% ======================================
    class UsersController {
        -usersService: UsersService
        +getProfile(userId: string): Promise~ApiResponse~
        +updateProfile(userId: string, updateDto): Promise~ApiResponse~
        +getAllUsers(): Promise~ApiResponse~
        +getUserById(id: string): Promise~ApiResponse~
        +updateUser(id: string, updateDto): Promise~ApiResponse~
        +deleteUser(id: string): Promise~ApiResponse~
    }

    class UsersService {
        -userRepository: Repository~User~
        +getProfile(userId: string): Promise~UserResponseDto~
        +updateProfile(userId: string, updateDto): Promise~UserResponseDto~
        +getAllUsers(): Promise~UserResponseDto[]~
        +getUserById(id: string): Promise~UserResponseDto~
        +updateUser(id: string, updateDto): Promise~UserResponseDto~
        +deleteUser(id: string): Promise~void~
    }

    %% ======================================
    %% NOTIFICATION SERVICE
    %% ======================================
    class NotificationController {
        -notificationService: NotificationService
        +sendEmail(emailDto): Promise~ApiResponse~
        +sendReservationConfirmation(confirmationDto): Promise~ApiResponse~
        +sendReservationCancellation(cancellationDto): Promise~ApiResponse~
        +sendEmailVerification(verificationDto): Promise~ApiResponse~
    }

    class NotificationService {
        +sendEmail(emailDto): Promise~NotificationResponse~
        +sendReservationConfirmation(confirmationDto): Promise~NotificationResponse~
        +sendReservationCancellation(cancellationDto): Promise~NotificationResponse~
        +sendEmailVerification(verificationDto): Promise~NotificationResponse~
    }

    %% ======================================
    %% SEARCH SERVICE
    %% ======================================
    class SearchController {
        -searchService: SearchService
        +searchHotels(searchDto): Promise~ApiResponse~
        +searchRooms(searchDto): Promise~ApiResponse~
        +getSearchSuggestions(query: string): Promise~ApiResponse~
        +getPopularDestinations(): Promise~ApiResponse~
    }

    class SearchService {
        +searchHotels(searchDto): Promise~HotelResponseDto[]~
        +searchRooms(searchDto): Promise~RoomResponseDto[]~
        +getSearchSuggestions(query: string): Promise~string[]~
        +getPopularDestinations(): Promise~string[]~
    }

    %% ======================================
    %% REPORT SERVICE
    %% ======================================
    class ReportController {
        -reportService: ReportService
        +generateSalesReport(reportDto): Promise~ApiResponse~
        +generateOccupancyReport(reportDto): Promise~ApiResponse~
        +generateRevenueReport(reportDto): Promise~ApiResponse~
        +downloadReport(id: string, format: string): Promise~ApiResponse~
    }

    class ReportService {
        +generateSalesReport(reportDto): Promise~ReportResponseDto~
        +generateOccupancyReport(reportDto): Promise~ReportResponseDto~
        +generateRevenueReport(reportDto): Promise~ReportResponseDto~
        +downloadReport(id: string, format: string): Promise~Buffer~
    }

    %% ======================================
    %% AVAILABILITY SERVICE
    %% ======================================
    class AvailabilityController {
        -availabilityService: AvailabilityService
        +createAvailability(createDto): Promise~ApiResponse~
        +checkAvailability(checkDto): Promise~ApiResponse~
        +getAvailabilityByRoom(roomId: string, startDate: string, endDate: string): Promise~ApiResponse~
        +updateAvailability(id: string, updateDto): Promise~ApiResponse~
        +reduceAvailability(roomId: string, date: string, quantity?: number): Promise~ApiResponse~
        +restoreAvailability(roomId: string, date: string, quantity?: number): Promise~ApiResponse~
        +deleteAvailability(id: string): Promise~ApiResponse~
    }

    class AvailabilityService {
        -availabilityRepository: Repository~Availability~
        +createAvailability(createDto): Promise~AvailabilityResponseDto~
        +getAvailabilityByRoomAndDateRange(roomId: string, startDate: string, endDate: string): Promise~AvailabilityResponseDto[]~
        +checkAvailability(checkDto): Promise~{available: boolean, availabilityData: AvailabilityResponseDto[]}~
        +updateAvailability(id: string, updateDto): Promise~AvailabilityResponseDto~
        +reduceAvailability(roomId: string, date: string, quantity: number): Promise~AvailabilityResponseDto~
        +restoreAvailability(roomId: string, date: string, quantity: number): Promise~AvailabilityResponseDto~
        +deleteAvailability(id: string): Promise~void~
    }

    %% ======================================
    %% RELATIONSHIPS
    %% ======================================
    
    %% API Gateway routes to all controllers (HTTP routing)
    APIGateway ..> AuthController : routes
    APIGateway ..> HotelsController : routes
    APIGateway ..> ReservationController : routes
    APIGateway ..> PaymentController : routes
    APIGateway ..> ReviewController : routes
    APIGateway ..> UsersController : routes
    APIGateway ..> NotificationController : routes
    APIGateway ..> SearchController : routes
    APIGateway ..> ReportController : routes
    APIGateway ..> AvailabilityController : routes

    %% Controller-Service relationships (direct injection/composition)
    AuthController --> AuthService : uses
    HotelsController --> HotelsService : uses
    ReservationController --> ReservationService : uses
    PaymentController --> PaymentService : uses
    ReviewController --> ReviewService : uses
    UsersController --> UsersService : uses
    NotificationController --> NotificationService : uses
    SearchController --> SearchService : uses
    ReportController --> ReportService : uses
    AvailabilityController --> AvailabilityService : uses

    %% Inter-microservice communication (HTTP requests)
    AuthService ..> NotificationController : HTTP POST /email-verification
    ReservationService ..> PaymentController : HTTP POST /payments/create
    ReservationService ..> NotificationController : HTTP POST /reservation-confirmation
    ReservationService ..> AvailabilityController : HTTP POST /availability/check
    ReservationService ..> AvailabilityController : HTTP POST /availability/reduce/:roomId/:date
    ReservationService ..> AvailabilityController : HTTP POST /availability/restore/:roomId/:date
    PaymentService ..> NotificationController : HTTP POST /payment-confirmation
    SearchService ..> HotelsController : HTTP GET /hotels/search
    ReportService ..> ReservationController : HTTP GET /reservations
    ReportService ..> PaymentController : HTTP GET /payments
    HotelsService ..> AvailabilityController : HTTP POST /availability/check
    HotelsService ..> AvailabilityController : HTTP GET /availability/room/:roomId
```

## Descripción del Diagrama

Este diagrama muestra la arquitectura simplificada de clases del backend del sistema de reservas, enfocándose en los componentes principales y sus relaciones.

### **Arquitectura de Microservicios**

1. **API Gateway**: Punto de entrada único que enruta solicitudes a los microservicios
2. **Auth Service**: Autenticación, autorización y gestión de sesiones
3. **Hotel Service**: Gestiona hoteles y habitaciones (unificado)
4. **Reservation Service**: Maneja el ciclo de vida de las reservas
5. **Payment Service**: Procesamiento de pagos y reembolsos
6. **Review Service**: Sistema de reseñas y calificaciones
7. **User Service**: Administración de perfiles de usuario
8. **Notification Service**: Envío de emails y notificaciones
9. **Search Service**: Búsqueda de hoteles y habitaciones
10. **Report Service**: Generación de reportes y analytics
11. **Availability Service**: Gestión de disponibilidad de habitaciones

### **Patrones de Arquitectura**

- **Microservicios**: Cada servicio es independiente y especializado
- **Controller-Service Pattern**: Separación de responsabilidades
- **Repository Pattern**: Abstracción de acceso a datos
- **API Gateway Pattern**: Punto único de entrada

### **Tipos de Relaciones UML**

- **Línea sólida (→)**: Composición/Inyección directa (Controller usa Service)
- **Línea punteada (..>)**: Dependencia/Comunicación HTTP entre microservicios

### **Comunicación Entre Microservicios (HTTP)**

#### **Integración con Availability Service (NUEVA)**
- **ReservationService → AvailabilityController**: 
  - `POST /availability/check` - Verificar disponibilidad antes de crear reserva
  - `POST /availability/reduce/:roomId/:date` - Reducir disponibilidad al crear reserva
  - `POST /availability/restore/:roomId/:date` - Restaurar disponibilidad al cancelar
- **HotelsService → AvailabilityController**:
  - `POST /availability/check` - Verificar disponibilidad para fechas específicas
  - `GET /availability/room/:roomId` - Obtener disponibilidad por rango de fechas

#### **Otras Comunicaciones**
- **AuthService → NotificationController**: `POST /email-verification`
- **ReservationService → PaymentController**: `POST /payments/create`
- **ReservationService → NotificationController**: `POST /reservation-confirmation`
- **PaymentService → NotificationController**: `POST /payment-confirmation`
- **SearchService → HotelsController**: `GET /hotels/search`
- **ReportService → Multiple Controllers**: `GET` para recopilación de datos

### **Características del Sistema**

- **Autenticación JWT**: Tokens seguros para autenticación
- **Autorización por roles**: Control de acceso basado en roles
- **Validación automática**: DTOs con validaciones
- **Documentación API**: Swagger/OpenAPI
- **Manejo consistente de errores**: Respuestas estandarizadas