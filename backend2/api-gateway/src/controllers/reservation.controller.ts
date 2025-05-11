import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Query, Param, InternalServerErrorException, NotFoundException, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole, ReservationStatus } from '@app/shared';
import { ReservationStatusUpdateDto } from '@app/shared/dto/reservation';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(
    @Inject('RESERVATION_SERVICE') private readonly reservationServiceClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationServiceClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reservations for the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all reservations' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      // If HOTEL_ADMIN, get reservations for their hotels
      // If SYSTEM_ADMIN, get all reservations
      // If CUSTOMER, get only their reservations
      return firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'findAll' }, 
          { userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching reservations');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the reservation' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'findOne' }, 
          { id, userId, userRole }
        )
      );
      
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }
      
      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching reservation');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Reservation created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() createReservationDto: any, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'create' }, 
          { ...createReservationDto, customerId: userId }
        )
      );
      
      // Send notification
      await this.sendReservationNotification(
        reservation.id, 
        userId,
        ReservationStatus.PENDING,
        'New reservation created'
      );
      
      return reservation;
    } catch (error) {
      throw new InternalServerErrorException('Error creating reservation');
    }
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation confirmed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async confirmReservation(
    @Param('id') id: string, 
    @Body() statusUpdateDto: ReservationStatusUpdateDto,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      // Force status to CONFIRMED
      statusUpdateDto.status = ReservationStatus.CONFIRMED;
      
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'updateStatus' }, 
          { id, statusUpdateDto, userId, userRole }
        )
      );
      
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }
      
      // Send notification
      await this.sendReservationNotification(
        id, 
        reservation.customerId,
        ReservationStatus.CONFIRMED,
        statusUpdateDto.message || 'Your reservation has been confirmed'
      );
      
      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error confirming reservation');
    }
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation rejected successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async rejectReservation(
    @Param('id') id: string, 
    @Body() statusUpdateDto: ReservationStatusUpdateDto,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      // Force status to REJECTED
      statusUpdateDto.status = ReservationStatus.REJECTED;
      
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'updateStatus' }, 
          { id, statusUpdateDto, userId, userRole }
        )
      );
      
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }
      
      // Send notification
      await this.sendReservationNotification(
        id, 
        reservation.customerId,
        ReservationStatus.REJECTED,
        statusUpdateDto.message || 'Your reservation has been rejected'
      );
      
      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error rejecting reservation');
    }
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation cancelled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async cancelReservation(
    @Param('id') id: string, 
    @Body() statusUpdateDto: ReservationStatusUpdateDto,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      // Force status to CANCELLED
      statusUpdateDto.status = ReservationStatus.CANCELLED;
      
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'updateStatus' }, 
          { id, statusUpdateDto, userId, userRole }
        )
      );
      
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }
      
      // Send notification to hotel admin
      await this.sendReservationNotification(
        id, 
        reservation.hotel.ownerId,
        ReservationStatus.CANCELLED,
        statusUpdateDto.message || 'A reservation has been cancelled'
      );
      
      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error cancelling reservation');
    }
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a reservation as completed' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation completed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async completeReservation(
    @Param('id') id: string, 
    @Body() statusUpdateDto: ReservationStatusUpdateDto,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      // Force status to COMPLETED
      statusUpdateDto.status = ReservationStatus.COMPLETED;
      
      const reservation = await firstValueFrom(
        this.reservationServiceClient.send(
          { cmd: 'updateStatus' }, 
          { id, statusUpdateDto, userId, userRole }
        )
      );
      
      if (!reservation) {
        throw new NotFoundException(`Reservation with ID ${id} not found`);
      }
      
      // Send notification
      await this.sendReservationNotification(
        id, 
        reservation.customerId,
        ReservationStatus.COMPLETED,
        statusUpdateDto.message || 'Your stay has been completed. Please leave a review!'
      );
      
      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error completing reservation');
    }
  }

  // Private method to send notifications
  private async sendReservationNotification(
    reservationId: string,
    userId: string,
    status: ReservationStatus,
    message: string
  ) {
    try {
      // Create notification types based on status
      let notificationType;
      switch (status) {
        case ReservationStatus.PENDING:
          notificationType = 'RESERVATION_CREATED';
          break;
        case ReservationStatus.CONFIRMED:
          notificationType = 'RESERVATION_CONFIRMED';
          break;
        case ReservationStatus.REJECTED:
          notificationType = 'RESERVATION_REJECTED';
          break;
        case ReservationStatus.CANCELLED:
          notificationType = 'RESERVATION_CANCELLED';
          break;
        case ReservationStatus.COMPLETED:
          notificationType = 'RESERVATION_COMPLETED';
          break;
        default:
          notificationType = 'SYSTEM';
      }
      
      return firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'create' },
          {
            type: notificationType,
            message,
            userId,
            data: { reservationId }
          }
        )
      );
    } catch (error) {
      console.error('Error sending notification', error);
      // Don't throw error here since sending notification 
      // shouldn't block the main operation
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort reservation service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortReservationService() {
    try {
      return firstValueFrom(
        this.reservationServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Reservation service execution aborted by admin');
    }
  }
}