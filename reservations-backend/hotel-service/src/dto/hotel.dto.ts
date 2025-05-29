import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ description: 'Street address', example: '123 Main Street' })
  @IsNotEmpty()
  @IsString()
  street!: string;

  @ApiProperty({ description: 'City name', example: 'New York' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiPropertyOptional({ description: 'State or province', example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Country name', example: 'United States' })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiPropertyOptional({ description: 'ZIP or postal code', example: '10001' })
  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CreateHotelDto {
  @ApiProperty({ description: 'Hotel name', example: 'Grand Hotel Paradise' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Hotel description', example: 'A luxurious 5-star hotel in the heart of the city' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Hotel address', type: AddressDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @ApiPropertyOptional({ description: 'Hotel amenities', example: ['WiFi', 'Pool', 'Gym', 'Spa'] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Hotel photos URLs', example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'] })
  @IsOptional()
  @IsArray()
  photos?: string[];
}

export class UpdateHotelDto {
  @ApiPropertyOptional({ description: 'Hotel name', example: 'Grand Hotel Paradise' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Hotel description', example: 'A luxurious 5-star hotel in the heart of the city' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Hotel address', type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({ description: 'Hotel amenities', example: ['WiFi', 'Pool', 'Gym', 'Spa'] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Hotel photos URLs', example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'] })
  @IsOptional()
  @IsArray()
  photos?: string[];
}

export class HotelResponseDto {
  @ApiProperty({ description: 'Hotel ID' })
  hotelId!: string;

  @ApiProperty({ description: 'Hotel name' })
  name!: string;

  @ApiProperty({ description: 'Hotel description' })
  description!: string;

  @ApiProperty({ description: 'Hotel owner ID' })
  ownerId!: string;

  @ApiPropertyOptional({ description: 'Average rating out of 5' })
  averageRating?: number;

  @ApiPropertyOptional({ description: 'Hotel address' })
  address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
  };

  @ApiPropertyOptional({ description: 'Hotel amenities' })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Hotel photos URLs' })
  photos?: string[];

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}