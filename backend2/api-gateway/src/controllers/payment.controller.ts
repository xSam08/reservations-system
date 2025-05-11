import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Query, Param, InternalServerErrorException, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '@app/shared';
import { ProcessPaymentDto } from '@app/shared/dto/payment/process-payment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentServiceClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationServiceClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all payments' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      return firstValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'findAll' }, 
          { userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching payments');
    }
  }

  @Get('reservation/:reservationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments for a reservation' })
  @ApiParam({ name: 'reservationId', description: 'Reservation ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all payments for the reservation' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findByReservation(@Param('reservationId') reservationId: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      return firstValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'findByReservation' }, 
          { reservationId, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching payments for reservation');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the payment' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const payment = await firstValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'findOne' }, 
          { id, userId, userRole }
        )
      );
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching payment');
    }
  }

  @Post('process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a payment for a reservation' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Payment processed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto, @Req() req: any) {
    try {
      const userId = req.user.sub;
      
      const payment = await firstValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'processPayment' }, 
          { ...processPaymentDto, userId }
        )
      );
      
      // If payment successful, send notification
      if (payment && payment.status === 'COMPLETED') {
        await firstValueFrom(
          this.notificationServiceClient.send(
            { cmd: 'create' },
            {
              type: 'PAYMENT_COMPLETED',
              message: `Payment of ${payment.amount.amount} ${payment.amount.currency} has been processed successfully.`,
              userId,
              data: { 
                paymentId: payment.id,
                reservationId: payment.reservationId 
              }
            }
          )
        );
      }
      
      return payment;
    } catch (error) {
      throw new InternalServerErrorException('Error processing payment');
    }
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm a payment (for offline payments)' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment confirmed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Payment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async confirmPayment(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const payment = await firstValueFrom(
        this.paymentServiceClient.send(
          { cmd: 'confirmPayment' }, 
          { id, userId, userRole }
        )
      );
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      // Send notification to customer
      await firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'create' },
          {
            type: 'PAYMENT_COMPLETED',
            message: `Your payment of ${payment.amount.amount} ${payment.amount.currency} has been confirmed.`,
            userId: payment.reservation.customerId,
            data: { 
              paymentId: payment.id,
              reservationId: payment.reservationId 
            }
          }
        )
      );
      
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error confirming payment');
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort payment service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortPaymentService() {
    try {
      return firstValueFrom(
        this.paymentServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Payment service execution aborted by admin');
    }
  }
}