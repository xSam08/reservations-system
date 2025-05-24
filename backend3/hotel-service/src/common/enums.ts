export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  HOTEL_ADMIN = 'HOTEL_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  SUITE = 'SUITE',
  DELUXE = 'DELUXE'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum NotificationType {
  RESERVATION = 'RESERVATION',
  PAYMENT = 'PAYMENT',
  REVIEW = 'REVIEW',
  SYSTEM = 'SYSTEM'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
