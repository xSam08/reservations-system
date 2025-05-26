import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewResponseDto,
  ReviewStatsDto,
  ReviewFilterDto
} from '../dto';
import { ApiResponse, PaginatedResponse } from '../common/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);
  private reviews: Map<string, ReviewResponseDto> = new Map();

  async createReview(dto: CreateReviewDto): Promise<ApiResponse<ReviewResponseDto>> {
    try {
      // Check if user already reviewed this reservation
      const existingReview = Array.from(this.reviews.values())
        .find(review => review.reservationId === dto.reservationId && review.userId === dto.userId);

      if (existingReview) {
        throw new BadRequestException('User already reviewed this reservation');
      }

      const reviewId = uuidv4();
      const review: ReviewResponseDto = {
        id: reviewId,
        reservationId: dto.reservationId,
        userId: dto.userId,
        hotelId: dto.hotelId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        cleanlinessRating: dto.cleanlinessRating,
        serviceRating: dto.serviceRating,
        locationRating: dto.locationRating,
        valueRating: dto.valueRating,
        tags: dto.tags || [],
        isVerified: true, // Assuming all reviews are verified for now
        helpfulCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userInfo: {
          name: 'Anonymous User', // In real app, fetch from user service
          isVerifiedGuest: true,
        },
      };

      this.reviews.set(reviewId, review);

      this.logger.log(`Review created: ${reviewId} for hotel ${dto.hotelId}`);

      return {
        success: true,
        message: 'Review created successfully',
        data: review,
      };
    } catch (error) {
      this.logger.error('Failed to create review:', error);
      return {
        success: false,
        message: 'Failed to create review',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getReview(reviewId: string): Promise<ApiResponse<ReviewResponseDto>> {
    try {
      const review = this.reviews.get(reviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }

      return {
        success: true,
        message: 'Review retrieved successfully',
        data: review,
      };
    } catch (error) {
      this.logger.error('Failed to get review:', error);
      return {
        success: false,
        message: 'Failed to retrieve review',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getReviews(filters: ReviewFilterDto): Promise<ApiResponse<PaginatedResponse<ReviewResponseDto>>> {
    try {
      let filteredReviews = Array.from(this.reviews.values());

      // Apply filters
      if (filters.hotelId) {
        filteredReviews = filteredReviews.filter(review => review.hotelId === filters.hotelId);
      }

      if (filters.userId) {
        filteredReviews = filteredReviews.filter(review => review.userId === filters.userId);
      }

      if (filters.minRating !== undefined) {
        filteredReviews = filteredReviews.filter(review => review.rating >= filters.minRating!);
      }

      if (filters.maxRating !== undefined) {
        filteredReviews = filteredReviews.filter(review => review.rating <= filters.maxRating!);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'date';
      const sortOrder = filters.sortOrder || 'desc';

      filteredReviews.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'helpful':
            comparison = a.helpfulCount - b.helpfulCount;
            break;
          case 'date':
          default:
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;
      const paginatedReviews = filteredReviews.slice(skip, skip + limit);

      const result: PaginatedResponse<ReviewResponseDto> = {
        data: paginatedReviews,
        total: filteredReviews.length,
        page,
        limit,
        totalPages: Math.ceil(filteredReviews.length / limit),
      };

      return {
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to get reviews:', error);
      return {
        success: false,
        message: 'Failed to retrieve reviews',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async updateReview(reviewId: string, dto: UpdateReviewDto): Promise<ApiResponse<ReviewResponseDto>> {
    try {
      const review = this.reviews.get(reviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }

      // Update fields
      if (dto.rating !== undefined) review.rating = dto.rating;
      if (dto.title !== undefined) review.title = dto.title;
      if (dto.comment !== undefined) review.comment = dto.comment;
      if (dto.cleanlinessRating !== undefined) review.cleanlinessRating = dto.cleanlinessRating;
      if (dto.serviceRating !== undefined) review.serviceRating = dto.serviceRating;
      if (dto.locationRating !== undefined) review.locationRating = dto.locationRating;
      if (dto.valueRating !== undefined) review.valueRating = dto.valueRating;
      if (dto.tags !== undefined) review.tags = dto.tags;

      review.updatedAt = new Date();
      this.reviews.set(reviewId, review);

      this.logger.log(`Review updated: ${reviewId}`);

      return {
        success: true,
        message: 'Review updated successfully',
        data: review,
      };
    } catch (error) {
      this.logger.error('Failed to update review:', error);
      return {
        success: false,
        message: 'Failed to update review',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async deleteReview(reviewId: string): Promise<ApiResponse<void>> {
    try {
      const review = this.reviews.get(reviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }

      this.reviews.delete(reviewId);

      this.logger.log(`Review deleted: ${reviewId}`);

      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete review:', error);
      return {
        success: false,
        message: 'Failed to delete review',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async markHelpful(reviewId: string): Promise<ApiResponse<ReviewResponseDto>> {
    try {
      const review = this.reviews.get(reviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }

      review.helpfulCount += 1;
      review.updatedAt = new Date();
      this.reviews.set(reviewId, review);

      this.logger.log(`Review marked as helpful: ${reviewId}`);

      return {
        success: true,
        message: 'Review marked as helpful',
        data: review,
      };
    } catch (error) {
      this.logger.error('Failed to mark review as helpful:', error);
      return {
        success: false,
        message: 'Failed to mark review as helpful',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getHotelStats(hotelId: string): Promise<ApiResponse<ReviewStatsDto>> {
    try {
      const hotelReviews = Array.from(this.reviews.values())
        .filter(review => review.hotelId === hotelId);

      if (hotelReviews.length === 0) {
        const emptyStats: ReviewStatsDto = {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          averageRatings: { overall: 0 },
          mostMentionedTags: [],
        };

        return {
          success: true,
          message: 'Hotel statistics retrieved successfully',
          data: emptyStats,
        };
      }

      const totalReviews = hotelReviews.length;
      const averageRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      hotelReviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          switch (review.rating) {
            case 5:
              ratingDistribution[5]++;
              break;
            case 4:
              ratingDistribution[4]++;
              break;
            case 3:
              ratingDistribution[3]++;
              break;
            case 2:
              ratingDistribution[2]++;
              break;
            case 1:
              ratingDistribution[1]++;
              break;
          }
        }
      });

      // Calculate average ratings
      const cleanlinessRatings = hotelReviews.filter(r => r.cleanlinessRating !== undefined).map(r => r.cleanlinessRating!);
      const serviceRatings = hotelReviews.filter(r => r.serviceRating !== undefined).map(r => r.serviceRating!);
      const locationRatings = hotelReviews.filter(r => r.locationRating !== undefined).map(r => r.locationRating!);
      const valueRatings = hotelReviews.filter(r => r.valueRating !== undefined).map(r => r.valueRating!);

      const averageRatings = {
        overall: averageRating,
        cleanliness: cleanlinessRatings.length > 0 ? 
          cleanlinessRatings.reduce((sum, rating) => sum + rating, 0) / cleanlinessRatings.length : undefined,
        service: serviceRatings.length > 0 ? 
          serviceRatings.reduce((sum, rating) => sum + rating, 0) / serviceRatings.length : undefined,
        location: locationRatings.length > 0 ? 
          locationRatings.reduce((sum, rating) => sum + rating, 0) / locationRatings.length : undefined,
        value: valueRatings.length > 0 ? 
          valueRatings.reduce((sum, rating) => sum + rating, 0) / valueRatings.length : undefined,
      };

      // Calculate most mentioned tags
      const tagCounts = new Map<string, number>();
      hotelReviews.forEach(review => {
        review.tags?.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      const mostMentionedTags = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const stats: ReviewStatsDto = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        averageRatings,
        mostMentionedTags,
      };

      return {
        success: true,
        message: 'Hotel statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.logger.error('Failed to get hotel stats:', error);
      return {
        success: false,
        message: 'Failed to retrieve hotel statistics',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
}