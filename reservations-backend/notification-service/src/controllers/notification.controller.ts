import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { SendEmailDto, SendTestEmailDto, ReservationConfirmationDto, ReservationCancellationDto, EmailVerificationDto } from '../dto';
import { ApiResponse as CustomApiResponse } from '../common/types';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for notification service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): CustomApiResponse<any> {
    return {
      success: true,
      message: 'Notification service is healthy',
      data: {
        service: 'notification-service',
        status: 'OK',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('test')
  @ApiOperation({ summary: 'Send test email' })
  @ApiBody({ type: SendTestEmailDto })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendTestEmail(@Body() dto: SendTestEmailDto): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendTestEmail(dto);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send custom email' })
  @ApiBody({ type: SendEmailDto })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendEmail(@Body() dto: SendEmailDto): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendEmail(dto);
  }

  @Post('reservation-confirmation')
  @ApiOperation({ summary: 'Send reservation confirmation email' })
  @ApiBody({ type: ReservationConfirmationDto })
  @ApiResponse({ status: 200, description: 'Confirmation email sent successfully' })
  async sendReservationConfirmation(
    @Body() dto: ReservationConfirmationDto,
  ): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendReservationConfirmation(
      dto.to,
      {
        id: dto.reservationId,
        hotelName: dto.hotelName,
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        guests: dto.guests,
        totalPrice: dto.totalPrice,
      },
    );
  }

  @Post('reservation-cancellation')
  @ApiOperation({ summary: 'Send reservation cancellation email' })
  @ApiBody({ type: ReservationCancellationDto })
  @ApiResponse({ status: 200, description: 'Cancellation email sent successfully' })
  async sendReservationCancellation(
    @Body() dto: ReservationCancellationDto,
  ): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendReservationCancellation(
      dto.to,
      {
        id: dto.reservationId,
        hotelName: dto.hotelName,
        reason: dto.reason,
      },
    );
  }

  @Post('email-verification')
  @ApiOperation({ summary: 'Send email verification email' })
  @ApiBody({ type: EmailVerificationDto })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  async sendEmailVerification(
    @Body() dto: EmailVerificationDto,
  ): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendEmailVerification(dto);
  }
}