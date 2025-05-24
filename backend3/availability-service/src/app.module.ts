import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './controllers/availability.controller';
import { AvailabilityService } from './services/availability.service';
import { Availability } from './entities/availability.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'app_user',
      password: process.env.DB_PASSWORD || 'app_password',
      database: process.env.DB_DATABASE || 'reservations',
      entities: [Availability],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Availability]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AppModule {}