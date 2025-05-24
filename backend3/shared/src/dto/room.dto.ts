import { IsNotEmpty, IsEnum, IsNumber, IsBoolean, IsOptional, IsString, IsArray, IsUrl, IsDecimal } from 'class-validator';
import { RoomType } from '../enums';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsEnum(RoomType)
  roomType: RoomType;

  @IsNumber()
  capacity: number;

  @IsNumber()
  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @IsDecimal({ decimal_digits: '2' })
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class RoomResponseDto {
  roomId: string;
  hotelId: string;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  isAvailable: boolean;
  price: {
    amount: number;
    currency: string;
  };
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}