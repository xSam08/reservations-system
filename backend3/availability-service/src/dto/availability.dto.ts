import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  availableRooms: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  totalRooms: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountedPrice?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE'])
  status?: string;
}

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  availableRooms?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountedPrice?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE'])
  status?: string;
}

export class CheckAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  guests?: number;
}

export class AvailabilityResponseDto {
  availabilityId: string;
  roomId: string;
  date: Date;
  availableRooms: number;
  totalRooms: number;
  basePrice?: number;
  discountedPrice?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}