import { IsString, IsNumber, IsOptional, IsUUID, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Reservation ID', example: '507f1f77bcf86cd799439011' })
  @IsUUID()
  reservationId: string;

  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Hotel ID', example: '507f1f77bcf86cd799439013' })
  @IsUUID()
  hotelId: string;

  @ApiProperty({ description: 'Overall rating', example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review title', example: 'Great stay!' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Review comment', example: 'Had a wonderful time at this hotel.' })
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  cleanlinessRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  serviceRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  locationRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valueRating?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  cleanlinessRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  serviceRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  locationRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valueRating?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ReviewResponseDto {
  id: string;
  reservationId: string;
  userId: string;
  hotelId: string;
  rating: number;
  title: string;
  comment: string;
  cleanlinessRating?: number;
  serviceRating?: number;
  locationRating?: number;
  valueRating?: number;
  tags?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  userInfo?: {
    name: string;
    isVerifiedGuest: boolean;
  };
}

export class ReviewStatsDto {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  averageRatings: {
    overall: number;
    cleanliness?: number;
    service?: number;
    location?: number;
    value?: number;
  };
  mostMentionedTags: Array<{
    tag: string;
    count: number;
  }>;
}

export class ReviewFilterDto {
  @IsOptional()
  @IsUUID()
  hotelId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxRating?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'rating' | 'date' | 'helpful';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}