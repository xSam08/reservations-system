import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create REST API application
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS
  app.enableCors();

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('API documentation for the user management microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Connect microservice for inter-service communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('MICROSERVICE_PORT', 3002),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT', 3000));
  
  console.log(`User service is running on: ${await app.getUrl()}`);
}

bootstrap();