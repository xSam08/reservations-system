import { IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../enums/reservation.enum';

export class CreateReservationDto {
  @ApiProperty({ description: 'Hotel ID', example: 'uuid-hotel-id' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ description: 'Room ID', example: 'uuid-room-id' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'Check-in date', example: '2024-12-25' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-12-30' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ description: 'Number of guests', example: 2 })
  @IsNumber()
  @Type(() => Number)
  guestCount: number;

  @ApiPropertyOptional({ description: 'Special requests', example: 'Late check-in requested' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class UpdateReservationDto {
  @ApiPropertyOptional({ description: 'Check-in date', example: '2024-12-25' })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @ApiPropertyOptional({ description: 'Check-out date', example: '2024-12-30' })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @ApiPropertyOptional({ description: 'Reservation status', enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Number of guests', example: 2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  guestCount?: number;

  @ApiPropertyOptional({ description: 'Special requests', example: 'Late check-in requested' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class UpdateReservationStatusDto {
  @ApiProperty({ description: 'New reservation status', enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiPropertyOptional({ description: 'Reason for status change', example: 'Customer requested cancellation' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CancelReservationDto {
  @ApiProperty({ description: 'Cancellation reason', example: 'Change of plans' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ReservationResponseDto {
  @ApiProperty({ description: 'Reservation ID' })
  reservationId: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Hotel ID' })
  hotelId: string;

  @ApiProperty({ description: 'Room ID' })
  roomId: string;

  @ApiProperty({ description: 'Check-in date' })
  checkInDate: Date;

  @ApiProperty({ description: 'Check-out date' })
  checkOutDate: Date;

  @ApiProperty({ description: 'Reservation status', enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ description: 'Number of guests' })
  guestCount: number;

  @ApiProperty({ description: 'Total price information' })
  totalPrice: {
    amount: number;
    currency: string;
  };

  @ApiProperty({ description: 'Special requests', nullable: true })
  specialRequests: string;

  @ApiProperty({ description: 'Cancellation reason', nullable: true })
  cancellationReason: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class ReservationFilterDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Filter by hotel ID' })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Filter from date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}