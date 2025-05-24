import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReservationService } from '../services/reservation.service';
import { AuthGuard } from '../guards/auth.guard';
import { 
  CreateReservationDto, 
  UpdateReservationDto, 
  UpdateReservationStatusDto,
  CancelReservationDto,
  ReservationResponseDto,
  ReservationFilterDto
} from '../dto/reservation.dto';
import { ResponseUtil } from '../common/response.util';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReservationController {

  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reservations with filtering' })
  @ApiResponse({ status: 200, description: 'Reservations retrieved successfully', type: [ReservationResponseDto] })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'hotelId', required: false, description: 'Filter by hotel ID' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Filter from date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Filter to date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  async getAllReservations(@Query() filterDto: ReservationFilterDto) {
    try {
      const result = await this.reservationService.findAll(filterDto);
      return ResponseUtil.success(result, 'Reservations retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending reservations' })
  @ApiResponse({ status: 200, description: 'Pending reservations retrieved successfully', type: [ReservationResponseDto] })
  async getPendingReservations(@Query() filterDto: ReservationFilterDto) {
    try {
      const result = await this.reservationService.findPending(filterDto);
      return ResponseUtil.success(result, 'Pending reservations retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Get reservation history (completed/cancelled)' })
  @ApiResponse({ status: 200, description: 'Reservation history retrieved successfully', type: [ReservationResponseDto] })
  async getReservationHistory(@Query() filterDto: ReservationFilterDto, @Request() req: any) {
    try {
      const result = await this.reservationService.findHistory(filterDto, req.user.sub);
      return ResponseUtil.success(result, 'Reservation history retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reservations by user ID' })
  @ApiResponse({ status: 200, description: 'User reservations retrieved successfully', type: [ReservationResponseDto] })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getReservationsByUser(@Param('userId') userId: string, @Query() filterDto: ReservationFilterDto) {
    try {
      const result = await this.reservationService.findByUserId(userId, filterDto);
      return ResponseUtil.success(result, 'User reservations retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: 'Get reservations by hotel ID' })
  @ApiResponse({ status: 200, description: 'Hotel reservations retrieved successfully', type: [ReservationResponseDto] })
  @ApiParam({ name: 'hotelId', description: 'Hotel ID' })
  async getReservationsByHotel(@Param('hotelId') hotelId: string, @Query() filterDto: ReservationFilterDto) {
    try {
      const result = await this.reservationService.findByHotelId(hotelId, filterDto);
      return ResponseUtil.success(result, 'Hotel reservations retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation retrieved successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async getReservationById(@Param('id') id: string) {
    try {
      const reservation = await this.reservationService.findById(id);
      return ResponseUtil.success(reservation, 'Reservation retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid reservation data' })
  @ApiResponse({ status: 409, description: 'Room not available for selected dates' })
  async createReservation(@Body() createReservationDto: CreateReservationDto, @Request() req: any) {
    try {
      const reservation = await this.reservationService.create(createReservationDto, req.user.sub);
      return ResponseUtil.success(reservation, 'Reservation created successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async updateReservation(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    try {
      const reservation = await this.reservationService.update(id, updateReservationDto);
      return ResponseUtil.success(reservation, 'Reservation updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update reservation status' })
  @ApiResponse({ status: 200, description: 'Reservation status updated successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async updateReservationStatus(@Param('id') id: string, @Body() statusDto: UpdateReservationStatusDto) {
    try {
      const reservation = await this.reservationService.updateStatus(id, statusDto.status, statusDto.reason);
      return ResponseUtil.success(reservation, 'Reservation status updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a reservation' })
  @ApiResponse({ status: 200, description: 'Reservation confirmed successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 400, description: 'Reservation cannot be confirmed' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async confirmReservation(@Param('id') id: string) {
    try {
      const reservation = await this.reservationService.confirm(id);
      return ResponseUtil.success(reservation, 'Reservation confirmed successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a reservation' })
  @ApiResponse({ status: 200, description: 'Reservation rejected successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 400, description: 'Reservation cannot be rejected' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async rejectReservation(@Param('id') id: string, @Body() reasonDto: { reason?: string }) {
    try {
      const reservation = await this.reservationService.reject(id, reasonDto.reason);
      return ResponseUtil.success(reservation, 'Reservation rejected successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiResponse({ status: 200, description: 'Reservation cancelled successfully', type: ReservationResponseDto })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 400, description: 'Reservation cannot be cancelled' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async cancelReservation(@Param('id') id: string, @Body() cancelDto: CancelReservationDto) {
    try {
      const reservation = await this.reservationService.cancel(id, cancelDto.reason);
      return ResponseUtil.success(reservation, 'Reservation cancelled successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async deleteReservation(@Param('id') id: string) {
    try {
      await this.reservationService.delete(id);
      return ResponseUtil.success(null, 'Reservation deleted successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}