import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HotelController } from './controllers/hotel.controller';
import { RoomController } from './controllers/room.controller';
import { ReservationController } from './controllers/reservation.controller';
import { PaymentController } from './controllers/payment.controller';
import { ReviewController } from './controllers/review.controller';
import { NotificationController } from './controllers/notification.controller';
import { ReportController } from './controllers/report.controller';
import { NotificationGateway } from './websocket/notification.gateway';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    
    // JWT Module for WebSocket Authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'supersecretjwtkey'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
    
    // Microservice clients
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST', 'auth-service'),
            port: configService.get('AUTH_SERVICE_PORT', 3001),
          },
        }),
      },
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST', 'user-service'),
            port: configService.get('USER_SERVICE_PORT', 3002),
          },
        }),
      },
      {
        name: 'HOTEL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('HOTEL_SERVICE_HOST', 'hotel-service'),
            port: configService.get('HOTEL_SERVICE_PORT', 3003),
          },
        }),
      },
      {
        name: 'ROOM_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ROOM_SERVICE_HOST', 'room-service'),
            port: configService.get('ROOM_SERVICE_PORT', 3004),
          },
        }),
      },
      {
        name: 'RESERVATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('RESERVATION_SERVICE_HOST', 'reservation-service'),
            port: configService.get('RESERVATION_SERVICE_PORT', 3005),
          },
        }),
      },
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_SERVICE_HOST', 'payment-service'),
            port: configService.get('PAYMENT_SERVICE_PORT', 3006),
          },
        }),
      },
      {
        name: 'REVIEW_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('REVIEW_SERVICE_HOST', 'review-service'),
            port: configService.get('REVIEW_SERVICE_PORT', 3007),
          },
        }),
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATION_SERVICE_HOST', 'notification-service'),
            port: configService.get('NOTIFICATION_SERVICE_PORT', 3008),
          },
        }),
      },
      {
        name: 'REPORT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('REPORT_SERVICE_HOST', 'report-service'),
            port: configService.get('REPORT_SERVICE_PORT', 3009),
          },
        }),
      },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    HotelController,
    RoomController,
    ReservationController,
    PaymentController,
    ReviewController,
    NotificationController,
    ReportController,
  ],
  providers: [
    NotificationGateway,
  ],
})
export class AppModule {}