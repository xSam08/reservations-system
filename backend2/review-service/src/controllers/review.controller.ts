import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Review } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: any) {} // Replace 'any' with actual ReviewService once created

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all reviews' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return review by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Review created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  create(@Body() createReviewDto: any) { // Replace 'any' with actual DTO
    return this.reviewService.create(createReviewDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateReviewDto: any) { // Replace 'any' with actual DTO
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort review service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Review service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_review_by_id' })
  getReviewById(id: string) {
    return this.reviewService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_reviews_by_hotel' })
  getReviewsByHotel(hotelId: string) {
    return this.reviewService.findByHotel(hotelId);
  }

  @MessagePattern({ cmd: 'get_reviews_by_user' })
  getReviewsByUser(userId: string) {
    return this.reviewService.findByUser(userId);
  }
}