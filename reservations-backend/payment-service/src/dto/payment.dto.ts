import { IsString, IsNumber, IsEmail, IsOptional, IsEnum, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Reservation ID', example: '507f1f77bcf86cd799439011' })
  @IsUUID()
  reservationId: string;

  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Payment amount', example: 299.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD', default: 'USD' })
  @IsString()
  currency: string = 'USD';

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment description', example: 'Hotel reservation payment' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Credit card number', example: '4111111111111111' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ description: 'Card holder name', example: 'John Doe' })
  @IsString()
  cardHolderName: string;

  @ApiProperty({ description: 'Expiry month', example: '12' })
  @IsString()
  expiryMonth: string;

  @ApiProperty({ description: 'Expiry year', example: '2025' })
  @IsString()
  expiryYear: string;

  @ApiProperty({ description: 'CVV code', example: '123' })
  @IsString()
  cvv: string;

  @ApiProperty({ description: 'Billing email', example: 'billing@example.com' })
  @IsEmail()
  billingEmail: string;
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment ID', example: '507f1f77bcf86cd799439011' })
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Payment intent ID from payment provider', example: 'pi_1234567890' })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund', example: '507f1f77bcf86cd799439011' })
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Refund amount (partial refund)', example: 150.00, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ description: 'Refund reason', example: 'Customer cancellation' })
  @IsString()
  reason: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Reservation ID' })
  reservationId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional({ description: 'Transaction ID from payment provider' })
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Payment description' })
  description?: string;

  @ApiProperty({ description: 'Payment creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Payment completion date' })
  completedAt?: Date;

  @ApiPropertyOptional({ description: 'Failure reason if payment failed' })
  failedReason?: string;
}

export class PaymentIntentDto {
  @ApiProperty({ description: 'Payment intent ID' })
  id: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Payment intent status' })
  status: string;

  @ApiPropertyOptional({ description: 'Client secret for frontend processing' })
  clientSecret?: string;
}