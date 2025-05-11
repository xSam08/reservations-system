import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsDateString, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomType } from '../../enums';

export class SearchHotelDto {
  @ApiProperty({ description: 'Search by location (city, country, etc.)', required: false })
  @IsOptional()
  @IsString()
  location?: string;
  
  @ApiProperty({ description: 'Search by hotel name', required: false })
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiProperty({ description: 'Minimum rating (0-5)', required: false, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  minRating?: number;
  
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
  
  @ApiProperty({ description: 'Check-in date', required: false })
  @IsOptional()
  @IsDateString()
  checkInDate?: string;
  
  @ApiProperty({ description: 'Check-out date', required: false })
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;
  
  @ApiProperty({ description: 'Room type', required: false, enum: RoomType })
  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;
  
  @ApiProperty({ description: 'Minimum guest capacity', required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  guestCount?: number;
  
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