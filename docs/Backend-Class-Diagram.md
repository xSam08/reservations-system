# Diagrama de Clases del Backend - Sistema de Reservas

```mermaid
classDiagram
    %% ======================================
    %% API GATEWAY
    %% ======================================
    class APIGateway {
        -authMiddleware: AuthMiddleware
        -rateLimitMiddleware: RateLimitMiddleware
        -loggerMiddleware: LoggerMiddleware
        -proxyMiddleware: ProxyMiddleware
        +routeRequest(path: string, method: string): Response
        +authenticate(token: string): boolean
        +rateLimit(ip: string): boolean
    }

    %% ======================================
    %% AUTH SERVICE
    %% ======================================
    class AuthController {
        -authService: AuthService
        +register(createUserDto: CreateUserDto): Promise~ApiResponse~
        +login(loginDto: LoginDto): Promise~ApiResponse~
        +getProfile(userId: string): Promise~ApiResponse~
        +updateProfile(userId: string, updateDto: UpdateUserDto): Promise~ApiResponse~
        +logout(userId: string): Promise~ApiResponse~
        +refreshToken(refreshTokenDto: RefreshTokenDto): Promise~ApiResponse~
        +forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise~ApiResponse~
        +resetPassword(resetPasswordDto: ResetPasswordDto): Promise~ApiResponse~
        +verifyEmail(verifyEmailDto: VerifyEmailDto): Promise~ApiResponse~
        +resendVerification(resendDto: ResendVerificationDto): Promise~ApiResponse~
        +validateToken(token: string): Promise~ApiResponse~
    }

    class AuthService {
        -userRepository: Repository~User~
        -jwtService: JwtService
        -configService: ConfigService
        +register(createUserDto: CreateUserDto): Promise~UserResponse~
        +login(user: User): Promise~LoginResponse~
        +validateUser(email: string, password: string): Promise~User~
        +getProfile(userId: string): Promise~UserResponseDto~
        +updateProfile(userId: string, updateDto: UpdateUserDto): Promise~UserResponseDto~
        +generateToken(user: User): Promise~string~
        +refreshToken(refreshTokenDto: RefreshTokenDto): Promise~TokenResponse~
        +forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise~MessageResponse~
        +resetPassword(resetPasswordDto: ResetPasswordDto): Promise~MessageResponse~
        +verifyEmail(verifyEmailDto: VerifyEmailDto): Promise~MessageResponse~
        +resendVerification(resendDto: ResendVerificationDto): Promise~MessageResponse~
        -sendVerificationEmail(email: string, token: string): Promise~void~
        -sendPasswordResetEmail(email: string, token: string): Promise~void~
        -hashPassword(password: string): Promise~string~
        -comparePasswords(password: string, hash: string): Promise~boolean~
        -mapToUserResponse(user: User): UserResponseDto
    }

    class JwtStrategy {
        -configService: ConfigService
        +validate(payload: JwtPayload): Promise~User~
    }

    class LocalStrategy {
        -authService: AuthService
        +validate(email: string, password: string): Promise~User~
    }

    class JwtAuthGuard {
        +canActivate(context: ExecutionContext): boolean
    }

    class LocalAuthGuard {
        +canActivate(context: ExecutionContext): boolean
    }

    %% ======================================
    %% HOTEL SERVICE
    %% ======================================
    class HotelsController {
        -hotelsService: HotelsService
        +create(createHotelDto: CreateHotelDto, userId: string): Promise~ApiResponse~
        +findAll(params: PaginationParams): Promise~ApiResponse~
        +search(query: string, params: PaginationParams): Promise~ApiResponse~
        +getMyHotels(userId: string, params: PaginationParams): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +update(id: string, updateDto: UpdateHotelDto, userId: string): Promise~ApiResponse~
        +remove(id: string, userId: string): Promise~ApiResponse~
        +getHotelRooms(hotelId: string, params: PaginationParams): Promise~ApiResponse~
        +getHotelReservations(hotelId: string, params: PaginationParams): Promise~ApiResponse~
        +getHotelStatistics(hotelId: string): Promise~ApiResponse~
        +updateHotelStatus(hotelId: string, status: string): Promise~ApiResponse~
    }

    class HotelsService {
        -hotelRepository: Repository~Hotel~
        -addressRepository: Repository~Address~
        -hotelAmenityRepository: Repository~HotelAmenity~
        -hotelPhotoRepository: Repository~HotelPhoto~
        +create(createHotelDto: CreateHotelDto, ownerId: string): Promise~HotelResponseDto~
        +findAll(params: PaginationParams): Promise~PaginatedResponse~HotelResponseDto~~
        +search(query: string, params: PaginationParams): Promise~PaginatedResponse~HotelResponseDto~~
        +findOne(id: string): Promise~HotelResponseDto~
        +findByOwner(ownerId: string, params: PaginationParams): Promise~PaginatedResponse~HotelResponseDto~~
        +update(id: string, updateDto: UpdateHotelDto, userId: string, userRole: string): Promise~HotelResponseDto~
        +remove(id: string, userId: string, userRole: string): Promise~void~
        +getHotelRooms(hotelId: string, params: PaginationParams): Promise~PaginatedResponse~RoomResponseDto~~
        +getHotelReservations(hotelId: string, userId: string, userRole: string, params: PaginationParams): Promise~PaginatedResponse~ReservationResponseDto~~
        +getHotelStatistics(hotelId: string, userId: string, userRole: string): Promise~HotelStatistics~
        +updateHotelStatus(hotelId: string, status: string): Promise~HotelResponseDto~
        -validateOwnership(hotelId: string, userId: string, userRole: string): Promise~void~
        -mapToHotelResponse(hotel: Hotel): HotelResponseDto
    }

    class RoomsController {
        -roomsService: RoomsService
        +create(createRoomDto: CreateRoomDto, userId: string): Promise~ApiResponse~
        +findAll(params: PaginationParams): Promise~ApiResponse~
        +search(searchDto: SearchRoomsDto): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +update(id: string, updateDto: UpdateRoomDto, userId: string): Promise~ApiResponse~
        +remove(id: string, userId: string): Promise~ApiResponse~
        +checkAvailability(roomId: string, dates: CheckAvailabilityDto): Promise~ApiResponse~
        +getRoomTypes(): Promise~ApiResponse~
    }

    class RoomsService {
        -roomRepository: Repository~Room~
        -roomAmenityRepository: Repository~RoomAmenity~
        -roomImageRepository: Repository~RoomImage~
        -roomPriceRepository: Repository~RoomPrice~
        +create(createRoomDto: CreateRoomDto, userId: string): Promise~RoomResponseDto~
        +findAll(params: PaginationParams): Promise~PaginatedResponse~RoomResponseDto~~
        +search(searchDto: SearchRoomsDto): Promise~PaginatedResponse~RoomResponseDto~~
        +findOne(id: string): Promise~RoomResponseDto~
        +update(id: string, updateDto: UpdateRoomDto, userId: string, userRole: string): Promise~RoomResponseDto~
        +remove(id: string, userId: string, userRole: string): Promise~void~
        +checkAvailability(roomId: string, checkInDate: Date, checkOutDate: Date): Promise~AvailabilityResponse~
        +getRoomTypes(): Promise~RoomType[]~
        -validateRoomOwnership(roomId: string, userId: string, userRole: string): Promise~void~
        -mapToRoomResponse(room: Room): RoomResponseDto
    }

    %% ======================================
    %% RESERVATION SERVICE
    %% ======================================
    class ReservationController {
        -reservationService: ReservationService
        +create(createReservationDto: CreateReservationDto): Promise~ApiResponse~
        +findAll(filters: ReservationFilterDto): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +update(id: string, updateDto: UpdateReservationDto): Promise~ApiResponse~
        +updateStatus(id: string, statusDto: UpdateReservationStatusDto): Promise~ApiResponse~
        +cancel(id: string, cancelDto: CancelReservationDto): Promise~ApiResponse~
        +getUserReservations(userId: string, params: PaginationParams): Promise~ApiResponse~
        +getHotelReservations(hotelId: string, params: PaginationParams): Promise~ApiResponse~
        +confirmReservation(id: string): Promise~ApiResponse~
    }

    class ReservationService {
        -reservationRepository: Repository~Reservation~
        +create(createReservationDto: CreateReservationDto, userId: string): Promise~ReservationResponseDto~
        +findAll(filters: ReservationFilterDto, params: PaginationParams): Promise~PaginatedResponse~ReservationResponseDto~~
        +findOne(id: string, userId: string, userRole: string): Promise~ReservationResponseDto~
        +update(id: string, updateDto: UpdateReservationDto, userId: string, userRole: string): Promise~ReservationResponseDto~
        +updateStatus(id: string, status: ReservationStatus, userId: string, userRole: string): Promise~ReservationResponseDto~
        +cancel(id: string, reason: string, userId: string, userRole: string): Promise~ReservationResponseDto~
        +getUserReservations(userId: string, params: PaginationParams): Promise~PaginatedResponse~ReservationResponseDto~~
        +getHotelReservations(hotelId: string, userId: string, userRole: string, params: PaginationParams): Promise~PaginatedResponse~ReservationResponseDto~~
        +confirmReservation(id: string, userId: string, userRole: string): Promise~ReservationResponseDto~
        -validateReservationAccess(reservationId: string, userId: string, userRole: string): Promise~Reservation~
        -calculateTotalAmount(roomId: string, checkInDate: Date, checkOutDate: Date): Promise~number~
        -mapToReservationResponse(reservation: Reservation): ReservationResponseDto
    }

    %% ======================================
    %% PAYMENT SERVICE
    %% ======================================
    class PaymentController {
        -paymentService: PaymentService
        +createPayment(createPaymentDto: CreatePaymentDto): Promise~ApiResponse~
        +processPayment(processPaymentDto: ProcessPaymentDto): Promise~ApiResponse~
        +getPaymentHistory(userId: string, params: PaginationParams): Promise~ApiResponse~
        +getPaymentById(id: string): Promise~ApiResponse~
        +refundPayment(id: string, refundDto: RefundPaymentDto): Promise~ApiResponse~
        +getPaymentMethods(): Promise~ApiResponse~
        +validateCard(cardDto: ValidateCardDto): Promise~ApiResponse~
    }

    class PaymentService {
        +createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise~PaymentResponseDto~
        +processPayment(processPaymentDto: ProcessPaymentDto, userId: string): Promise~PaymentResponseDto~
        +getPaymentHistory(userId: string, params: PaginationParams): Promise~PaginatedResponse~PaymentResponseDto~~
        +getPaymentById(id: string, userId: string, userRole: string): Promise~PaymentResponseDto~
        +refundPayment(id: string, refundDto: RefundPaymentDto, userId: string, userRole: string): Promise~PaymentResponseDto~
        +getPaymentMethods(): Promise~PaymentMethod[]~
        +validateCard(cardDto: ValidateCardDto): Promise~CardValidationResponse~
        -processCardPayment(paymentData: CardPaymentData): Promise~PaymentResult~
        -processPayPalPayment(paymentData: PayPalPaymentData): Promise~PaymentResult~
        -processBankTransfer(paymentData: BankTransferData): Promise~PaymentResult~
        -validatePaymentAccess(paymentId: string, userId: string, userRole: string): Promise~Payment~
    }

    %% ======================================
    %% REVIEW SERVICE
    %% ======================================
    class ReviewController {
        -reviewService: ReviewService
        +create(createReviewDto: CreateReviewDto): Promise~ApiResponse~
        +findAll(params: PaginationParams): Promise~ApiResponse~
        +search(searchDto: SearchReviewsDto): Promise~ApiResponse~
        +findOne(id: string): Promise~ApiResponse~
        +update(id: string, updateDto: UpdateReviewDto): Promise~ApiResponse~
        +remove(id: string): Promise~ApiResponse~
        +getHotelReviews(hotelId: string, params: PaginationParams): Promise~ApiResponse~
        +getUserReviews(userId: string, params: PaginationParams): Promise~ApiResponse~
        +getHotelStats(hotelId: string): Promise~ApiResponse~
        +markHelpful(id: string): Promise~ApiResponse~
    }

    class ReviewService {
        +create(createReviewDto: CreateReviewDto, userId: string): Promise~ReviewResponseDto~
        +findAll(params: PaginationParams): Promise~PaginatedResponse~ReviewResponseDto~~
        +search(searchDto: SearchReviewsDto): Promise~PaginatedResponse~ReviewResponseDto~~
        +findOne(id: string): Promise~ReviewResponseDto~
        +update(id: string, updateDto: UpdateReviewDto, userId: string, userRole: string): Promise~ReviewResponseDto~
        +remove(id: string, userId: string, userRole: string): Promise~void~
        +getHotelReviews(hotelId: string, params: PaginationParams): Promise~PaginatedResponse~ReviewResponseDto~~
        +getUserReviews(userId: string, params: PaginationParams): Promise~PaginatedResponse~ReviewResponseDto~~
        +getHotelStats(hotelId: string): Promise~HotelReviewStats~
        +markHelpful(id: string, userId: string): Promise~ReviewResponseDto~
        -validateReviewAccess(reviewId: string, userId: string, userRole: string): Promise~Review~
        -mapToReviewResponse(review: Review): ReviewResponseDto
    }

    %% ======================================
    %% USER SERVICE
    %% ======================================
    class UsersController {
        -usersService: UsersService
        +getProfile(userId: string): Promise~ApiResponse~
        +updateProfile(userId: string, updateDto: UpdateUserDto): Promise~ApiResponse~
        +getAllUsers(params: PaginationParams): Promise~ApiResponse~
        +getUserById(id: string): Promise~ApiResponse~
        +updateUser(id: string, updateDto: UpdateUserDto): Promise~ApiResponse~
        +deleteUser(id: string): Promise~ApiResponse~
        +updateUserStatus(id: string, statusDto: UpdateUserStatusDto): Promise~ApiResponse~
        +getUserStatistics(id: string): Promise~ApiResponse~
    }

    class UsersService {
        -userRepository: Repository~User~
        +getProfile(userId: string): Promise~UserResponseDto~
        +updateProfile(userId: string, updateDto: UpdateUserDto): Promise~UserResponseDto~
        +getAllUsers(params: PaginationParams): Promise~PaginatedResponse~UserResponseDto~~
        +getUserById(id: string, requestingUserId: string, requestingUserRole: string): Promise~UserResponseDto~
        +updateUser(id: string, updateDto: UpdateUserDto, requestingUserId: string, requestingUserRole: string): Promise~UserResponseDto~
        +deleteUser(id: string, requestingUserId: string, requestingUserRole: string): Promise~void~
        +updateUserStatus(id: string, status: string, requestingUserId: string, requestingUserRole: string): Promise~UserResponseDto~
        +getUserStatistics(id: string, requestingUserId: string, requestingUserRole: string): Promise~UserStatistics~
        -validateAdminAccess(requestingUserRole: string): void
        -mapToUserResponse(user: User): UserResponseDto
    }

    %% ======================================
    %% NOTIFICATION SERVICE
    %% ======================================
    class NotificationController {
        -notificationService: NotificationService
        +getHealth(): ApiResponse
        +sendTestEmail(testEmailDto: SendTestEmailDto): Promise~ApiResponse~
        +sendEmail(emailDto: SendEmailDto): Promise~ApiResponse~
        +sendReservationConfirmation(confirmationDto: ReservationConfirmationDto): Promise~ApiResponse~
        +sendReservationCancellation(cancellationDto: ReservationCancellationDto): Promise~ApiResponse~
        +sendEmailVerification(verificationDto: EmailVerificationDto): Promise~ApiResponse~
    }

    class NotificationService {
        +sendTestEmail(testEmailDto: SendTestEmailDto): Promise~NotificationResponse~
        +sendEmail(emailDto: SendEmailDto): Promise~NotificationResponse~
        +sendReservationConfirmation(confirmationDto: ReservationConfirmationDto): Promise~NotificationResponse~
        +sendReservationCancellation(cancellationDto: ReservationCancellationDto): Promise~NotificationResponse~
        +sendEmailVerification(verificationDto: EmailVerificationDto): Promise~NotificationResponse~
        -sendEmailInternal(to: string, subject: string, content: string): Promise~void~
        -generateEmailTemplate(type: string, data: any): string
    }

    %% ======================================
    %% SEARCH SERVICE
    %% ======================================
    class SearchController {
        -searchService: SearchService
        +searchHotels(searchDto: SearchHotelsDto): Promise~ApiResponse~
        +searchRooms(searchDto: SearchRoomsDto): Promise~ApiResponse~
        +getSearchSuggestions(query: string): Promise~ApiResponse~
        +getPopularDestinations(): Promise~ApiResponse~
        +getAdvancedFilters(): Promise~ApiResponse~
    }

    class SearchService {
        +searchHotels(searchDto: SearchHotelsDto): Promise~PaginatedResponse~HotelResponseDto~~
        +searchRooms(searchDto: SearchRoomsDto): Promise~PaginatedResponse~RoomResponseDto~~
        +getSearchSuggestions(query: string): Promise~SearchSuggestion[]~
        +getPopularDestinations(): Promise~PopularDestination[]~
        +getAdvancedFilters(): Promise~AdvancedFilters~
        -buildHotelSearchQuery(searchDto: SearchHotelsDto): QueryBuilder
        -buildRoomSearchQuery(searchDto: SearchRoomsDto): QueryBuilder
        -applyHotelFilters(query: QueryBuilder, filters: HotelFilters): QueryBuilder
        -applyRoomFilters(query: QueryBuilder, filters: RoomFilters): QueryBuilder
    }

    %% ======================================
    %% REPORT SERVICE
    %% ======================================
    class ReportController {
        -reportService: ReportService
        +generateSalesReport(reportDto: GenerateReportDto): Promise~ApiResponse~
        +generateOccupancyReport(reportDto: GenerateReportDto): Promise~ApiResponse~
        +generateCustomerReport(reportDto: GenerateReportDto): Promise~ApiResponse~
        +generateRevenueReport(reportDto: GenerateReportDto): Promise~ApiResponse~
        +getReportHistory(params: PaginationParams): Promise~ApiResponse~
        +downloadReport(id: string, format: string): Promise~ApiResponse~
    }

    class ReportService {
        +generateSalesReport(reportDto: GenerateReportDto, userId: string, userRole: string): Promise~ReportResponseDto~
        +generateOccupancyReport(reportDto: GenerateReportDto, userId: string, userRole: string): Promise~ReportResponseDto~
        +generateCustomerReport(reportDto: GenerateReportDto, userId: string, userRole: string): Promise~ReportResponseDto~
        +generateRevenueReport(reportDto: GenerateReportDto, userId: string, userRole: string): Promise~ReportResponseDto~
        +getReportHistory(userId: string, userRole: string, params: PaginationParams): Promise~PaginatedResponse~ReportResponseDto~~
        +downloadReport(id: string, format: string, userId: string, userRole: string): Promise~ReportFileResponse~
        -validateReportAccess(userId: string, userRole: string): void
        -generateSalesData(filters: ReportFilters): Promise~SalesData[]~
        -generateOccupancyData(filters: ReportFilters): Promise~OccupancyData[]~
        -generateCustomerData(filters: ReportFilters): Promise~CustomerData[]~
        -generateRevenueData(filters: ReportFilters): Promise~RevenueData[]~
        -exportToPDF(data: any[], template: string): Promise~Buffer~
        -exportToExcel(data: any[], template: string): Promise~Buffer~
        -exportToCSV(data: any[]): Promise~string~
    }

    %% ======================================
    %% AVAILABILITY SERVICE
    %% ======================================
    class AvailabilityController {
        -availabilityService: AvailabilityService
        +checkAvailability(checkDto: CheckAvailabilityDto): Promise~ApiResponse~
        +updateAvailability(updateDto: UpdateAvailabilityDto): Promise~ApiResponse~
        +getAvailabilityCalendar(roomId: string, month: number, year: number): Promise~ApiResponse~
        +bulkUpdateAvailability(bulkDto: BulkUpdateAvailabilityDto): Promise~ApiResponse~
    }

    class AvailabilityService {
        -availabilityRepository: Repository~Availability~
        +checkAvailability(checkDto: CheckAvailabilityDto): Promise~AvailabilityResponseDto~
        +updateAvailability(updateDto: UpdateAvailabilityDto, userId: string, userRole: string): Promise~AvailabilityResponseDto~
        +getAvailabilityCalendar(roomId: string, month: number, year: number, userId: string, userRole: string): Promise~CalendarResponseDto~
        +bulkUpdateAvailability(bulkDto: BulkUpdateAvailabilityDto, userId: string, userRole: string): Promise~BulkAvailabilityResponseDto~
        -validateRoomAccess(roomId: string, userId: string, userRole: string): Promise~void~
        -checkDateConflicts(roomId: string, startDate: Date, endDate: Date): Promise~boolean~
        -mapToAvailabilityResponse(availability: Availability): AvailabilityResponseDto
    }

    %% ======================================
    %% SHARED UTILITIES
    %% ======================================
    class ResponseUtil {
        +success(data: any, message?: string): ApiResponse
        +error(message: string, statusCode?: number): ApiResponse
        +paginated(data: any[], total: number, page: number, limit: number): PaginatedApiResponse
    }

    class PaginationUtil {
        +paginate(query: QueryBuilder, page: number, limit: number): Promise~PaginatedResponse~T~~
        +calculateOffset(page: number, limit: number): number
        +calculateTotalPages(total: number, limit: number): number
    }

    class AuthGuard {
        +canActivate(context: ExecutionContext): boolean
        -validateToken(token: string): Promise~boolean~
        -extractUserFromToken(token: string): Promise~User~
    }

    %% ======================================
    %% RELATIONSHIPS
    %% ======================================
    
    %% API Gateway relationships
    APIGateway --> AuthController : routes auth requests
    APIGateway --> HotelsController : routes hotel requests
    APIGateway --> ReservationController : routes reservation requests
    APIGateway --> PaymentController : routes payment requests
    APIGateway --> ReviewController : routes review requests
    APIGateway --> UsersController : routes user requests
    APIGateway --> NotificationController : routes notification requests
    APIGateway --> SearchController : routes search requests
    APIGateway --> ReportController : routes report requests
    APIGateway --> AvailabilityController : routes availability requests

    %% Auth Service relationships
    AuthController --> AuthService
    AuthService --> JwtStrategy
    AuthService --> LocalStrategy
    AuthController --> JwtAuthGuard
    AuthController --> LocalAuthGuard
    AuthService --> NotificationService : sends verification emails

    %% Hotel Service relationships
    HotelsController --> HotelsService
    RoomsController --> RoomsService
    HotelsController --> AuthGuard
    RoomsController --> AuthGuard
    HotelsService --> ReservationService : gets hotel reservations
    RoomsService --> AvailabilityService : checks room availability

    %% Reservation Service relationships
    ReservationController --> ReservationService
    ReservationController --> AuthGuard
    ReservationService --> PaymentService : processes payments
    ReservationService --> NotificationService : sends confirmations

    %% Payment Service relationships
    PaymentController --> PaymentService
    PaymentController --> AuthGuard
    PaymentService --> NotificationService : sends payment confirmations

    %% Review Service relationships
    ReviewController --> ReviewService
    ReviewController --> AuthGuard

    %% User Service relationships
    UsersController --> UsersService
    UsersController --> AuthGuard

    %% Notification Service relationships
    NotificationController --> NotificationService

    %% Search Service relationships
    SearchController --> SearchService
    SearchController --> AuthGuard
    SearchService --> HotelsService : searches hotels
    SearchService --> RoomsService : searches rooms

    %% Report Service relationships
    ReportController --> ReportService
    ReportController --> AuthGuard
    ReportService --> ReservationService : gets reservation data
    ReportService --> PaymentService : gets payment data
    ReportService --> HotelsService : gets hotel data

    %% Availability Service relationships
    AvailabilityController --> AvailabilityService
    AvailabilityController --> AuthGuard

    %% Utility relationships
    AuthController --> ResponseUtil
    HotelsController --> ResponseUtil
    ReservationController --> ResponseUtil
    PaymentController --> ResponseUtil
    ReviewController --> ResponseUtil
    UsersController --> ResponseUtil
    NotificationController --> ResponseUtil
    SearchController --> ResponseUtil
    ReportController --> ResponseUtil
    AvailabilityController --> ResponseUtil

    HotelsService --> PaginationUtil
    ReservationService --> PaginationUtil
    ReviewService --> PaginationUtil
    UsersService --> PaginationUtil
    SearchService --> PaginationUtil
    ReportService --> PaginationUtil
```

## Descripción del Diagrama

Este diagrama muestra la arquitectura de clases del backend del sistema de reservas, organizado por microservicios:

### **Arquitectura de Microservicios**

1. **API Gateway**: Punto de entrada único que enruta todas las solicitudes a los microservicios correspondientes
2. **Auth Service**: Maneja autenticación, autorización y gestión de usuarios
3. **Hotel Service**: Gestiona hoteles y habitaciones
4. **Reservation Service**: Maneja reservas y su ciclo de vida
5. **Payment Service**: Procesa pagos y reembolsos
6. **Review Service**: Gestiona reseñas y calificaciones
7. **User Service**: Administración de perfiles de usuario
8. **Notification Service**: Envío de emails y notificaciones
9. **Search Service**: Búsqueda avanzada de hoteles y habitaciones
10. **Report Service**: Generación de reportes y analytics
11. **Availability Service**: Gestión de disponibilidad de habitaciones

### **Patrones de Diseño Implementados**

- **Controller-Service Pattern**: Separación de lógica de presentación y negocio
- **Repository Pattern**: Abstracción de acceso a datos
- **Strategy Pattern**: Diferentes estrategias de autenticación (JWT, Local)
- **Guard Pattern**: Protección de endpoints con guards de autorización
- **Utility Pattern**: Clases utilitarias compartidas (ResponseUtil, PaginationUtil)

### **Características Principales**

- **Autenticación JWT**: Sistema de tokens seguro
- **Autorización basada en roles**: CUSTOMER, HOTEL_ADMIN, SYSTEM_ADMIN
- **Paginación**: Implementada en todos los servicios relevantes
- **Validación**: DTOs con validaciones automáticas
- **Documentación**: Swagger/OpenAPI en todos los endpoints
- **Manejo de errores**: Respuestas consistentes y manejo centralizado
- **Microservicios comunicándose**: Servicios interdependientes para funcionalidades complejas