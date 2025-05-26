import { IsString, IsNumber, IsEmail, IsOptional, IsEnum, Min, IsUUID } from 'class-validator';

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
  @IsUUID()
  reservationId: string;

  @IsString()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string = 'USD';

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  description?: string;

  // Card details (for demo purposes - in production use tokenization)
  @IsString()
  cardNumber: string;

  @IsString()
  cardHolderName: string;

  @IsString()
  expiryMonth: string;

  @IsString()
  expiryYear: string;

  @IsString()
  cvv: string;

  @IsEmail()
  billingEmail: string;
}

export class ProcessPaymentDto {
  @IsUUID()
  paymentId: string;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

export class RefundPaymentDto {
  @IsUUID()
  paymentId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsString()
  reason: string;
}

export class PaymentResponseDto {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failedReason?: string;
}

export class PaymentIntentDto {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}