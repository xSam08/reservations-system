import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { SendEmailDto, SendTestEmailDto } from '../dto';
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
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendTestEmail(@Body() dto: SendTestEmailDto): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendTestEmail(dto);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send custom email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendEmail(@Body() dto: SendEmailDto): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendEmail(dto);
  }

  @Post('reservation-confirmation')
  @ApiOperation({ summary: 'Send reservation confirmation email' })
  @ApiResponse({ status: 200, description: 'Confirmation email sent successfully' })
  async sendReservationConfirmation(
    @Body() body: { to: string; reservationData: any },
  ): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendReservationConfirmation(
      body.to,
      body.reservationData,
    );
  }

  @Post('reservation-cancellation')
  @ApiOperation({ summary: 'Send reservation cancellation email' })
  @ApiResponse({ status: 200, description: 'Cancellation email sent successfully' })
  async sendReservationCancellation(
    @Body() body: { to: string; reservationData: any },
  ): Promise<CustomApiResponse<any>> {
    return await this.notificationService.sendReservationCancellation(
      body.to,
      body.reservationData,
    );
  }
}