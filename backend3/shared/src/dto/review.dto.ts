import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsUrl, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class ReviewResponseDto {
  reviewId: string;
  customerId: string;
  hotelId: string;
  reservationId?: string;
  rating: number;
  content?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}