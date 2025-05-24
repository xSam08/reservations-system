import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsModule } from './hotels.module';
import { Hotel } from './entities/hotel.entity';
import { Address } from './entities/address.entity';
import { HotelAmenity } from './entities/hotel-amenity.entity';
import { HotelPhoto } from './entities/hotel-photo.entity';
import { Room } from './entities/room.entity';
import { RoomPrice } from './entities/room-price.entity';
import { RoomAmenity } from './entities/room-amenity.entity';
import { RoomImage } from './entities/room-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Hotel,
          Address,
          HotelAmenity,
          HotelPhoto,
          Room,
          RoomPrice,
          RoomAmenity,
          RoomImage,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    HotelsModule,
  ],
})
export class AppModule {}