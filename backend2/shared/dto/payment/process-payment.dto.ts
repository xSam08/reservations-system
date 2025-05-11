import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class CreditCardDetails {
  @ApiProperty({ description: 'Card number' })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({ description: 'Card holder name' })
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @ApiProperty({ description: 'Expiration month (MM)' })
  @IsString()
  @IsNotEmpty()
  expirationMonth: string;

  @ApiProperty({ description: 'Expiration year (YYYY)' })
  @IsString()
  @IsNotEmpty()
  expirationYear: string;

  @ApiProperty({ description: 'CVV/CVC security code' })
  @IsString()
  @IsNotEmpty()
  cvv: string;
}

export class PayPalDetails {
  @ApiProperty({ description: 'PayPal email address' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class BankTransferDetails {
  @ApiProperty({ description: 'Bank account number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ description: 'Account holder name' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Reservation ID' })
  @IsUUID()
  reservationId: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ description: 'Credit card details (required for CREDIT_CARD and DEBIT_CARD methods)', required: false, type: CreditCardDetails })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreditCardDetails)
  creditCardDetails?: CreditCardDetails;

  @ApiProperty({ description: 'PayPal details (required for PAYPAL method)', required: false, type: PayPalDetails })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PayPalDetails)
  paypalDetails?: PayPalDetails;

  @ApiProperty({ description: 'Bank transfer details (required for BANK_TRANSFER method)', required: false, type: BankTransferDetails })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BankTransferDetails)
  bankTransferDetails?: BankTransferDetails;
}