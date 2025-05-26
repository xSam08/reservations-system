import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewResponseDto,
  ReviewStatsDto,
  ReviewFilterDto
} from '../dto';
import { ApiResponse as CustomApiResponse, PaginatedResponse } from '../common/types';

@ApiTags('Reviews')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for review service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): CustomApiResponse<any> {
    return {
      success: true,
      message: 'Review service is healthy',
      data: {
        service: 'review-service',
        status: 'OK',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createReview(@Body() dto: CreateReviewDto): Promise<CustomApiResponse<ReviewResponseDto>> {
    return await this.reviewService.createReview(dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Get reviews with filters' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviews(@Query() filters: ReviewFilterDto): Promise<CustomApiResponse<PaginatedResponse<ReviewResponseDto>>> {
    return await this.reviewService.getReviews(filters);
  }

  @Get('hotel/:hotelId/stats')
  @ApiOperation({ summary: 'Get hotel review statistics' })
  @ApiParam({ name: 'hotelId', description: 'Hotel ID' })
  @ApiResponse({ status: 200, description: 'Hotel statistics retrieved successfully' })
  async getHotelStats(@Param('hotelId') hotelId: string): Promise<CustomApiResponse<ReviewStatsDto>> {
    return await this.reviewService.getHotelStats(hotelId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReview(@Param('id') id: string): Promise<CustomApiResponse<ReviewResponseDto>> {
    return await this.reviewService.getReview(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateReview(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto
  ): Promise<CustomApiResponse<ReviewResponseDto>> {
    return await this.reviewService.updateReview(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(@Param('id') id: string): Promise<CustomApiResponse<void>> {
    return await this.reviewService.deleteReview(id);
  }

  @Post(':id/helpful')
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review marked as helpful' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async markHelpful(@Param('id') id: string): Promise<CustomApiResponse<ReviewResponseDto>> {
    return await this.reviewService.markHelpful(id);
  }
}