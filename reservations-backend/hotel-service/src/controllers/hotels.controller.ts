import { ResponseUtil } from "../common/response.util";
import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HotelsService } from '../services/hotels.service';
import { CreateHotelDto, UpdateHotelDto } from '../dto';
import { UserRole } from '../common/enums';
import { PaginationParams } from '../common/types';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({ status: 201, description: 'Hotel created successfully' })
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      if (userRole !== UserRole.HOTEL_ADMIN && userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Only hotel admins can create hotels');
      }

      const result = await this.hotelsService.create(createHotelDto, userId);
      return ResponseUtil.success(result, 'Hotel created successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotels with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  async findAll(
    @Query() params: PaginationParams & { 
      city?: string; 
      country?: string; 
      minPrice?: number; 
      maxPrice?: number; 
    }
  ) {
    try {
      const result = await this.hotelsService.findAll(params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search hotels by name, description, or location' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  async search(
    @Query('q') query: string,
    @Query() params: PaginationParams
  ) {
    try {
      const result = await this.hotelsService.search(query, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('my-hotels')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get hotels owned by current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  async getMyHotels(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams
  ) {
    try {
      if (userRole !== UserRole.HOTEL_ADMIN && userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Only hotel admins can view their hotels');
      }

      const result = await this.hotelsService.findByOwner(userId, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel retrieved successfully' })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.hotelsService.findOne(id);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      const result = await this.hotelsService.update(id, updateHotelDto, userId, userRole);
      return ResponseUtil.success(result, 'Hotel updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel deleted successfully' })
  async remove(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      await this.hotelsService.remove(id, userId, userRole);
      return ResponseUtil.success(null, 'Hotel deleted successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get hotels by owner ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  async getHotelsByOwner(
    @Param('ownerId') ownerId: string,
    @Query() params: PaginationParams
  ) {
    try {
      const result = await this.hotelsService.findByOwner(ownerId, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id/rooms')
  @ApiOperation({ summary: 'Get all rooms for a specific hotel' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Hotel rooms retrieved successfully' })
  async getHotelRooms(
    @Param('id') hotelId: string,
    @Query() params: PaginationParams & { available?: boolean }
  ) {
    try {
      const result = await this.hotelsService.getHotelRooms(hotelId, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id/reservations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reservations for a specific hotel' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Hotel reservations retrieved successfully' })
  async getHotelReservations(
    @Param('id') hotelId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams & { status?: string }
  ) {
    try {
      const result = await this.hotelsService.getHotelReservations(hotelId, userId, userRole, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id/statistics')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get hotel statistics and analytics' })
  @ApiResponse({ status: 200, description: 'Hotel statistics retrieved successfully' })
  async getHotelStatistics(
    @Param('id') hotelId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      const result = await this.hotelsService.getHotelStatistics(hotelId, userId, userRole);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hotel status (admin only)' })
  @ApiResponse({ status: 200, description: 'Hotel status updated successfully' })
  async updateHotelStatus(
    @Param('id') hotelId: string,
    @Body() statusDto: { status: 'active' | 'inactive' | 'suspended' },
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Only system admins can update hotel status');
      }

      const result = await this.hotelsService.updateHotelStatus(hotelId, statusDto.status);
      return ResponseUtil.success(result, 'Hotel status updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}