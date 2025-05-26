import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto, SendTestEmailDto } from '../dto';
import { ApiResponse } from '../common/types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get('SMTP_PORT') || '587'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendTestEmail(dto: SendTestEmailDto): Promise<ApiResponse<any>> {
    try {
      const subject = dto.subject || 'Test Email from Hotel Reservation System';
      const html = `
        <h2>🏨 Hotel Reservation System - Test Email</h2>
        <p>¡Hola!</p>
        <p>Este es un correo de prueba del sistema de reservas de hoteles.</p>
        <p>Si recibes este mensaje, el servicio de notificaciones está funcionando correctamente.</p>
        <hr>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <p>Servicio: Notification Service</p>
        <p style="color: #888;">Este es un correo automático, por favor no respondas.</p>
      `;

      const result = await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to: dto.to,
        subject,
        html,
      });

      this.logger.log(`Test email sent successfully to ${dto.to}`);

      return {
        success: true,
        message: 'Test email sent successfully',
        data: {
          to: dto.to,
          subject,
          messageId: result.messageId,
          sentAt: new Date(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send test email to ${dto.to}:`, error);
      return {
        success: false,
        message: 'Failed to send test email',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async sendEmail(dto: SendEmailDto): Promise<ApiResponse<any>> {
    try {
      const result = await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
        attachments: dto.attachments,
      });

      this.logger.log(`Email sent successfully to ${dto.to}`);

      return {
        success: true,
        message: 'Email sent successfully',
        data: {
          to: dto.to,
          subject: dto.subject,
          messageId: result.messageId,
          sentAt: new Date(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${dto.to}:`, error);
      return {
        success: false,
        message: 'Failed to send email',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async sendReservationConfirmation(
    to: string,
    reservationData: any,
  ): Promise<ApiResponse<any>> {
    try {
      const subject = 'Confirmación de Reserva - Hotel Reservation System';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🏨 Confirmación de Reserva</h2>
          <p>¡Hola!</p>
          <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Detalles de la Reserva</h3>
            <p><strong>ID de Reserva:</strong> ${reservationData.id || 'N/A'}</p>
            <p><strong>Hotel:</strong> ${reservationData.hotelName || 'N/A'}</p>
            <p><strong>Check-in:</strong> ${reservationData.checkIn || 'N/A'}</p>
            <p><strong>Check-out:</strong> ${reservationData.checkOut || 'N/A'}</p>
            <p><strong>Huéspedes:</strong> ${reservationData.guests || 'N/A'}</p>
            <p><strong>Total:</strong> $${reservationData.totalPrice || 'N/A'}</p>
          </div>
          
          <p>Gracias por elegir nuestro servicio.</p>
          <p style="color: #888;">Este es un correo automático, por favor no respondas.</p>
        </div>
      `;

      return await this.sendEmail({
        to,
        subject,
        text: `Confirmación de Reserva - ID: ${reservationData.id}`,
        html,
      });
    } catch (error) {
      this.logger.error('Failed to send reservation confirmation:', error);
      return {
        success: false,
        message: 'Failed to send reservation confirmation email',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async sendReservationCancellation(
    to: string,
    reservationData: any,
  ): Promise<ApiResponse<any>> {
    try {
      const subject = 'Cancelación de Reserva - Hotel Reservation System';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">🚫 Cancelación de Reserva</h2>
          <p>Tu reserva ha sido cancelada.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Detalles de la Reserva Cancelada</h3>
            <p><strong>ID de Reserva:</strong> ${reservationData.id || 'N/A'}</p>
            <p><strong>Hotel:</strong> ${reservationData.hotelName || 'N/A'}</p>
            <p><strong>Motivo:</strong> ${reservationData.reason || 'No especificado'}</p>
          </div>
          
          <p>Si tienes alguna pregunta, por favor contacta con nuestro servicio al cliente.</p>
          <p style="color: #888;">Este es un correo automático, por favor no respondas.</p>
        </div>
      `;

      return await this.sendEmail({
        to,
        subject,
        text: `Cancelación de Reserva - ID: ${reservationData.id}`,
        html,
      });
    } catch (error) {
      this.logger.error('Failed to send reservation cancellation:', error);
      return {
        success: false,
        message: 'Failed to send reservation cancellation email',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
}