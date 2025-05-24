import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsArray()
  photos?: string[];
}

export class UpdateHotelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsArray()
  photos?: string[];
}

export class HotelResponseDto {
  hotelId!: string;
  name!: string;
  description!: string;
  ownerId!: string;
  averageRating?: number;
  address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
  };
  amenities?: string[];
  photos?: string[];
  createdAt!: Date;
  updatedAt!: Date;
}