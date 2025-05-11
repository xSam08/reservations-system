import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Set up CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');
  
  // WebSocket adapter for real-time notifications
  app.useWebSocketAdapter(new WsAdapter(app));

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Hotel Reservation System API')
    .setDescription('API documentation for the hotel reservation system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('hotels', 'Hotel management endpoints')
    .addTag('rooms', 'Room management endpoints')
    .addTag('reservations', 'Reservation management endpoints')
    .addTag('payments', 'Payment management endpoints')
    .addTag('reviews', 'Review management endpoints')
    .addTag('notifications', 'Notification endpoints')
    .addTag('reports', 'Report generation endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`API Gateway running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/docs`);
}

bootstrap();