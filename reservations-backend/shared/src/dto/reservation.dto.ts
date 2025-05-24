import { IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../enums';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  guestCount: number;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsNumber()
  guestCount?: number;
}

export class ReservationResponseDto {
  reservationId: string;
  customerId: string;
  hotelId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: ReservationStatus;
  guestCount: number;
  totalPrice: {
    amount: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}