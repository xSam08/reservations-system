import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Room ID', example: '507f1f77bcf86cd799439014' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'Date for availability', example: '2024-06-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Number of available rooms', example: 5, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  availableRooms: number;

  @ApiProperty({ description: 'Total number of rooms', example: 10, minimum: 1 })
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
  @ApiProperty({ description: 'Room ID', example: '507f1f77bcf86cd799439014' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'Check-in date', example: '2024-06-15' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ description: 'Check-out date', example: '2024-06-18' })
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