import { IsEmail, IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED'
}

export class SendEmailDto {
  @ApiProperty({
    description: 'Email address of the recipient',
    example: 'user@example.com'
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Subject of the email',
    example: 'Welcome to Hotel Reservations!'
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Plain text content of the email',
    example: 'Thank you for registering with our hotel reservation system.'
  })
  @IsString()
  text: string;

  @ApiPropertyOptional({
    description: 'HTML content of the email',
    example: '<h1>Welcome!</h1><p>Thank you for registering.</p>'
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiPropertyOptional({
    description: 'Email attachments',
    example: []
  })
  @IsOptional()
  @IsArray()
  attachments?: any[];
}

export class SendTestEmailDto {
  @ApiProperty({
    description: 'Email address to send test email to',
    example: 'test@example.com'
  })
  @IsEmail()
  to: string;

  @ApiPropertyOptional({
    description: 'Subject for test email',
    example: 'Test Email from Notification Service'
  })
  @IsOptional()
  @IsString()
  subject?: string;
}

export class CreateEmailNotificationDto {
  @ApiProperty({
    description: 'ID of the user',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Email address of the recipient',
    example: 'customer@example.com'
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Subject of the notification email',
    example: 'Reservation Confirmation'
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Message content of the notification',
    example: 'Your reservation has been confirmed for Hotel Paradise.'
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Template ID for email formatting',
    example: 'reservation-confirmation'
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Additional data for template variables',
    example: { hotelName: 'Hotel Paradise', checkIn: '2024-06-15' }
  })
  @IsOptional()
  data?: any;
}

export class ReservationConfirmationDto {
  @ApiProperty({
    description: 'Email address of the guest',
    example: 'guest@example.com'
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Unique reservation identifier',
    example: 'RES-2024-001234'
  })
  @IsString()
  reservationId: string;

  @ApiProperty({
    description: 'Name of the hotel',
    example: 'Hotel Paradise Resort'
  })
  @IsString()
  hotelName: string;

  @ApiProperty({
    description: 'Check-in date',
    example: '2024-06-15'
  })
  @IsString()
  checkIn: string;

  @ApiProperty({
    description: 'Check-out date',
    example: '2024-06-18'
  })
  @IsString()
  checkOut: string;

  @ApiProperty({
    description: 'Number of guests',
    example: '2 adults, 1 child'
  })
  @IsString()
  guests: string;

  @ApiProperty({
    description: 'Total price of the reservation',
    example: '$450.00'
  })
  @IsString()
  totalPrice: string;
}

export class ReservationCancellationDto {
  @ApiProperty({
    description: 'Email address of the guest',
    example: 'guest@example.com'
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'Unique reservation identifier',
    example: 'RES-2024-001234'
  })
  @IsString()
  reservationId: string;

  @ApiProperty({
    description: 'Name of the hotel',
    example: 'Hotel Paradise Resort'
  })
  @IsString()
  hotelName: string;

  @ApiPropertyOptional({
    description: 'Reason for cancellation',
    example: 'Change of travel plans'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class EmailVerificationDto {
  @ApiProperty({
    description: 'Email address to verify',
    example: 'newuser@example.com'
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: 'URL for email verification',
    example: 'https://hotel-reservations.com/verify-email'
  })
  @IsString()
  verificationUrl: string;

  @ApiProperty({
    description: 'Verification token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  })
  @IsString()
  token: string;
}

export class EmailNotificationResponseDto {
  @ApiProperty({
    description: 'Unique notification ID',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who triggered the notification',
    example: '507f1f77bcf86cd799439012'
  })
  userId: string;

  @ApiProperty({
    description: 'Email address of the recipient',
    example: 'customer@example.com'
  })
  to: string;

  @ApiProperty({
    description: 'Subject of the email notification',
    example: 'Reservation Confirmation'
  })
  subject: string;

  @ApiProperty({
    description: 'Message content of the notification',
    example: 'Your reservation has been confirmed.'
  })
  message: string;

  @ApiProperty({
    description: 'Current status of the email',
    enum: EmailStatus,
    example: EmailStatus.SENT
  })
  status: EmailStatus;

  @ApiProperty({
    description: 'Timestamp when notification was created',
    example: '2024-06-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Timestamp when email was sent',
    example: '2024-06-15T10:31:00Z'
  })
  sentAt?: Date;

  @ApiPropertyOptional({
    description: 'Error message if email failed to send',
    example: 'SMTP connection failed'
  })
  error?: string;
}