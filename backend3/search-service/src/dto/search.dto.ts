import { IsOptional, IsString, IsDateString, IsNumber, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class HotelSearchDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  guests?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  amenities?: string[];

  @IsOptional()
  @IsEnum(['BUDGET', 'ECONOMY', 'COMFORT', 'LUXURY', 'PREMIUM'])
  category?: string;

  @IsOptional()
  @IsString()
  sortBy?: string; // price_asc, price_desc, rating_desc, name_asc

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;
}

export class RoomSearchDto {
  @IsString()
  hotelId: string;

  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  guests?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  amenities?: string[];

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsString()
  sortBy?: string; // price_asc, price_desc, capacity_asc, capacity_desc

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;
}

export class SearchSuggestionsDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsEnum(['hotels', 'cities', 'locations'])
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  limit?: number;
}

export class SearchResponseDto {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters?: {
    locations: string[];
    priceRange: { min: number; max: number };
    amenities: string[];
    categories: string[];
    ratings: number[];
  };
}