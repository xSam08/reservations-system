import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsService } from './services/hotels.service';
import { RoomsService } from './services/rooms.service';
import { HotelsController } from './controllers/hotels.controller';
import { RoomsController, RoomsGlobalController } from './controllers/rooms.controller';
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
    TypeOrmModule.forFeature([
      Hotel,
      Address,
      HotelAmenity,
      HotelPhoto,
      Room,
      RoomPrice,
      RoomAmenity,
      RoomImage,
    ])
  ],
  controllers: [HotelsController, RoomsController, RoomsGlobalController],
  providers: [HotelsService, RoomsService],
  exports: [HotelsService, RoomsService],
})
export class HotelsModule {}