import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  CreatePaymentDto, 
  ProcessPaymentDto, 
  RefundPaymentDto, 
  PaymentResponseDto,
  PaymentStatus,
  PaymentIntentDto 
} from '../dto';
import { ApiResponse } from '../common/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private payments: Map<string, any> = new Map();

  async createPayment(dto: CreatePaymentDto): Promise<ApiResponse<PaymentResponseDto>> {
    try {
      const paymentId = uuidv4();
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate card validation
      if (!this.isValidCard(dto.cardNumber)) {
        return {
          success: false,
          message: 'Invalid card number',
          errors: ['Card number is invalid'],
        };
      }

      const payment: PaymentResponseDto = {
        id: paymentId,
        reservationId: dto.reservationId,
        userId: dto.userId,
        amount: dto.amount,
        currency: dto.currency,
        method: dto.method,
        status: PaymentStatus.PENDING,
        transactionId,
        description: dto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.payments.set(paymentId, payment);

      this.logger.log(`Payment created: ${paymentId} for reservation ${dto.reservationId}`);

      return {
        success: true,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      this.logger.error('Failed to create payment:', error);
      return {
        success: false,
        message: 'Failed to create payment',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async processPayment(dto: ProcessPaymentDto): Promise<ApiResponse<PaymentResponseDto>> {
    try {
      const payment = this.payments.get(dto.paymentId);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestException('Payment cannot be processed in current status');
      }

      // Simulate payment processing
      payment.status = PaymentStatus.PROCESSING;
      payment.updatedAt = new Date();
      this.payments.set(dto.paymentId, payment);

      // Simulate async processing
      setTimeout(() => {
        const shouldSucceed = Math.random() > 0.1; // 90% success rate
        
        if (shouldSucceed) {
          payment.status = PaymentStatus.COMPLETED;
          payment.completedAt = new Date();
          this.logger.log(`Payment ${dto.paymentId} completed successfully`);
        } else {
          payment.status = PaymentStatus.FAILED;
          payment.failedReason = 'Insufficient funds';
          this.logger.warn(`Payment ${dto.paymentId} failed: Insufficient funds`);
        }
        
        payment.updatedAt = new Date();
        this.payments.set(dto.paymentId, payment);
      }, 2000);

      this.logger.log(`Processing payment: ${dto.paymentId}`);

      return {
        success: true,
        message: 'Payment is being processed',
        data: payment,
      };
    } catch (error) {
      this.logger.error('Failed to process payment:', error);
      return {
        success: false,
        message: 'Failed to process payment',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getPayment(paymentId: string): Promise<ApiResponse<PaymentResponseDto>> {
    try {
      const payment = this.payments.get(paymentId);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return {
        success: true,
        message: 'Payment retrieved successfully',
        data: payment,
      };
    } catch (error) {
      this.logger.error('Failed to get payment:', error);
      return {
        success: false,
        message: 'Failed to retrieve payment',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getPaymentsByReservation(reservationId: string): Promise<ApiResponse<PaymentResponseDto[]>> {
    try {
      const payments = Array.from(this.payments.values())
        .filter(payment => payment.reservationId === reservationId);

      return {
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
      };
    } catch (error) {
      this.logger.error('Failed to get payments by reservation:', error);
      return {
        success: false,
        message: 'Failed to retrieve payments',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async refundPayment(dto: RefundPaymentDto): Promise<ApiResponse<PaymentResponseDto>> {
    try {
      const payment = this.payments.get(dto.paymentId);
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status !== PaymentStatus.COMPLETED) {
        throw new BadRequestException('Only completed payments can be refunded');
      }

      const refundAmount = dto.amount || payment.amount;
      if (refundAmount > payment.amount) {
        throw new BadRequestException('Refund amount cannot exceed payment amount');
      }

      // Create refund record
      const refundId = uuidv4();
      const refund = {
        id: refundId,
        paymentId: dto.paymentId,
        amount: refundAmount,
        reason: dto.reason,
        status: PaymentStatus.REFUNDED,
        createdAt: new Date(),
      };

      // Update original payment
      payment.status = PaymentStatus.REFUNDED;
      payment.updatedAt = new Date();
      this.payments.set(dto.paymentId, payment);

      this.logger.log(`Payment ${dto.paymentId} refunded: $${refundAmount}`);

      return {
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      };
    } catch (error) {
      this.logger.error('Failed to refund payment:', error);
      return {
        success: false,
        message: 'Failed to refund payment',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'USD'): Promise<ApiResponse<PaymentIntentDto>> {
    try {
      const intentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientSecret = `${intentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

      const paymentIntent: PaymentIntentDto = {
        id: intentId,
        amount,
        currency,
        status: 'requires_payment_method',
        clientSecret,
      };

      this.logger.log(`Payment intent created: ${intentId} for amount ${amount} ${currency}`);

      return {
        success: true,
        message: 'Payment intent created successfully',
        data: paymentIntent,
      };
    } catch (error) {
      this.logger.error('Failed to create payment intent:', error);
      return {
        success: false,
        message: 'Failed to create payment intent',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  private isValidCard(cardNumber: string): boolean {
    // Simple Luhn algorithm check
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  async getAllPayments(): Promise<ApiResponse<PaymentResponseDto[]>> {
    try {
      const payments = Array.from(this.payments.values());
      
      return {
        success: true,
        message: 'All payments retrieved successfully',
        data: payments,
      };
    } catch (error) {
      this.logger.error('Failed to get all payments:', error);
      return {
        success: false,
        message: 'Failed to retrieve payments',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
}