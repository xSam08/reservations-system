import { ResponseUtil } from "../common/response.util";
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from '../services/availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto, CheckAvailabilityDto } from '../dto/availability.dto';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create room availability' })
  @ApiResponse({ status: 201, description: 'Availability created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAvailability(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    try {
      const result = await this.availabilityService.createAvailability(createAvailabilityDto);
      return ResponseUtil.success(result, 'Availability created successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get availability by room and date range' })
  @ApiResponse({ status: 200, description: 'Availability retrieved successfully' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  async getAvailabilityByRoom(
    @Param('roomId') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    try {
      const result = await this.availabilityService.getAvailabilityByRoomAndDateRange(roomId, startDate, endDate);
      return ResponseUtil.success(result, 'Availability retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('check')
  @ApiOperation({ summary: 'Check room availability for booking' })
  @ApiResponse({ status: 200, description: 'Availability checked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
    try {
      const result = await this.availabilityService.checkAvailability(checkAvailabilityDto);
      return ResponseUtil.success(result, 'Availability checked successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Put(':availabilityId')
  @ApiOperation({ summary: 'Update room availability' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Availability not found' })
  async updateAvailability(
    @Param('availabilityId') availabilityId: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto
  ) {
    try {
      const result = await this.availabilityService.updateAvailability(availabilityId, updateAvailabilityDto);
      return ResponseUtil.success(result, 'Availability updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('reduce/:roomId/:date')
  @ApiOperation({ summary: 'Reduce available rooms (for booking)' })
  @ApiResponse({ status: 200, description: 'Availability reduced successfully' })
  @ApiResponse({ status: 404, description: 'Availability not found' })
  @ApiQuery({ name: 'quantity', required: false, description: 'Number of rooms to reduce (default: 1)' })
  async reduceAvailability(
    @Param('roomId') roomId: string,
    @Param('date') date: string,
    @Query('quantity') quantity?: number
  ) {
    try {
      const result = await this.availabilityService.reduceAvailability(roomId, date, quantity || 1);
      return ResponseUtil.success(result, 'Availability reduced successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('restore/:roomId/:date')
  @ApiOperation({ summary: 'Restore available rooms (for cancellation)' })
  @ApiResponse({ status: 200, description: 'Availability restored successfully' })
  @ApiResponse({ status: 404, description: 'Availability not found' })
  @ApiQuery({ name: 'quantity', required: false, description: 'Number of rooms to restore (default: 1)' })
  async restoreAvailability(
    @Param('roomId') roomId: string,
    @Param('date') date: string,
    @Query('quantity') quantity?: number
  ) {
    try {
      const result = await this.availabilityService.restoreAvailability(roomId, date, quantity || 1);
      return ResponseUtil.success(result, 'Availability restored successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':availabilityId')
  @ApiOperation({ summary: 'Delete room availability' })
  @ApiResponse({ status: 200, description: 'Availability deleted successfully' })
  @ApiResponse({ status: 404, description: 'Availability not found' })
  async deleteAvailability(@Param('availabilityId') availabilityId: string) {
    try {
      await this.availabilityService.deleteAvailability(availabilityId);
      return ResponseUtil.success(null, 'Availability deleted successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}