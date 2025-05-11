import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Reservation } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: any) {} // Replace 'any' with actual ReservationService once created

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all reservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return reservation by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Reservation created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  create(@Body() createReservationDto: any) { // Replace 'any' with actual DTO
    return this.reservationService.create(createReservationDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update reservation' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateReservationDto: any) { // Replace 'any' with actual DTO
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reservation not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort reservation service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Reservation service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_reservation_by_id' })
  getReservationById(id: string) {
    return this.reservationService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_reservations_by_user' })
  getReservationsByUser(userId: string) {
    return this.reservationService.findByUser(userId);
  }
}