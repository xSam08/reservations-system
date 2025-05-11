import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Payment } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: any) {} // Replace 'any' with actual PaymentService once created

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all payments' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return payment by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Payment created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  create(@Body() createPaymentDto: any) { // Replace 'any' with actual DTO
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updatePaymentDto: any) { // Replace 'any' with actual DTO
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort payment service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Payment service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_payment_by_id' })
  getPaymentById(id: string) {
    return this.paymentService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_payments_by_reservation' })
  getPaymentsByReservation(reservationId: string) {
    return this.paymentService.findByReservation(reservationId);
  }
}