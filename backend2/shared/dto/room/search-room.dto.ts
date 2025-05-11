import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsDateString, IsEnum, IsUUID, ArrayMinSize, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomType } from '../../enums';

export class DateRangeDto {
  @ApiProperty({ description: 'Start date for availability check' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for availability check' })
  @IsDateString()
  endDate: string;
}

export class SearchRoomDto {
  @ApiProperty({ description: 'Hotel ID', required: false })
  @IsOptional()
  @IsUUID()
  hotelId?: string;
  
  @ApiProperty({ description: 'Room type', required: false, enum: RoomType })
  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;
  
  @ApiProperty({ description: 'Minimum price per night', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;
  
  @ApiProperty({ description: 'Maximum price per night', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;
  
  @ApiProperty({ description: 'Minimum guest capacity', required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minCapacity?: number;
  
  @ApiProperty({ description: 'Check-in date', required: false })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;
  
  @ApiProperty({ description: 'Check-out date', required: false })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;
  
  @ApiProperty({ description: 'Only show available rooms', required: false, default: true })
  @IsOptional()
  @Type(() => Boolean)
  onlyAvailable?: boolean = true;
  
  @ApiProperty({ description: 'Page number', required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
  
  @ApiProperty({ description: 'Results per page', required: false, default: 10, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}