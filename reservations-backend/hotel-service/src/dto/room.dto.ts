import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { RoomType } from '../common/enums';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  roomNumber!: string;

  @IsEnum(RoomType)
  roomType!: RoomType;

  @IsNotEmpty()
  @IsNumber()
  capacity!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
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
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class RoomResponseDto {
  roomId!: string;
  hotelId!: string;
  roomNumber!: string;
  roomType!: RoomType;
  capacity!: number;
  price!: number;
  currency?: string;
  description?: string;
  size?: number;
  amenities?: string[];
  images?: string[];
  isAvailable!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}