import { IsNotEmpty, IsEnum, IsString, IsNumber, IsOptional, IsDecimal } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../enums';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  reservationId: string;

  @IsNumber()
  @IsDecimal({ decimal_digits: '2' })
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class PaymentResponseDto {
  paymentId: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}