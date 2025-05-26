import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { 
  CreatePaymentDto, 
  ProcessPaymentDto, 
  RefundPaymentDto,
  PaymentResponseDto,
  PaymentIntentDto
} from '../dto';
import { ApiResponse as CustomApiResponse } from '../common/types';

@ApiTags('Payments')
@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for payment service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): CustomApiResponse<any> {
    return {
      success: true,
      message: 'Payment service is healthy',
      data: {
        service: 'payment-service',
        status: 'OK',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createPayment(@Body() dto: CreatePaymentDto): Promise<CustomApiResponse<PaymentResponseDto>> {
    return await this.paymentService.createPayment(dto);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process a payment' })
  @ApiResponse({ status: 200, description: 'Payment processing initiated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async processPayment(@Body() dto: ProcessPaymentDto): Promise<CustomApiResponse<PaymentResponseDto>> {
    return await this.paymentService.processPayment(dto);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refundPayment(@Body() dto: RefundPaymentDto): Promise<CustomApiResponse<PaymentResponseDto>> {
    return await this.paymentService.refundPayment(dto);
  }

  @Post('create-intent')
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  async createPaymentIntent(
    @Body() body: { amount: number; currency?: string }
  ): Promise<CustomApiResponse<PaymentIntentDto>> {
    return await this.paymentService.createPaymentIntent(body.amount, body.currency);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id') id: string): Promise<CustomApiResponse<PaymentResponseDto>> {
    return await this.paymentService.getPayment(id);
  }

  @Get('reservation/:reservationId')
  @ApiOperation({ summary: 'Get payments by reservation ID' })
  @ApiParam({ name: 'reservationId', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getPaymentsByReservation(
    @Param('reservationId') reservationId: string
  ): Promise<CustomApiResponse<PaymentResponseDto[]>> {
    return await this.paymentService.getPaymentsByReservation(reservationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'All payments retrieved successfully' })
  async getAllPayments(): Promise<CustomApiResponse<PaymentResponseDto[]>> {
    return await this.paymentService.getAllPayments();
  }
}