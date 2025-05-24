import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Room } from '../entities/room.entity';
import { RoomPrice } from '../entities/room-price.entity';
import { RoomAmenity } from '../entities/room-amenity.entity';
import { RoomImage } from '../entities/room-image.entity';
import { Hotel } from '../entities/hotel.entity';
import { CreateRoomDto, UpdateRoomDto, RoomResponseDto } from '../dto';
import { UserRole, RoomType } from '../common/enums';
import { PaginationParams, PaginatedResponse } from '../common/types';
import { PaginationUtil } from '../common/pagination.util';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomPrice)
    private roomPriceRepository: Repository<RoomPrice>,
    @InjectRepository(RoomAmenity)
    private roomAmenityRepository: Repository<RoomAmenity>,
    @InjectRepository(RoomImage)
    private roomImageRepository: Repository<RoomImage>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async create(hotelId: string, createRoomDto: CreateRoomDto, userId: string, userRole: string): Promise<RoomResponseDto> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: hotelId }
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only add rooms to your own hotels');
    }

    const existingRoom = await this.roomRepository.findOne({
      where: { hotel_id: hotelId, room_number: createRoomDto.roomNumber }
    });

    if (existingRoom) {
      throw new ConflictException('Room number already exists in this hotel');
    }

    const room = this.roomRepository.create({
      room_id: uuidv4(),
      hotel_id: hotelId,
      room_number: createRoomDto.roomNumber,
      room_type: createRoomDto.roomType,
      capacity: createRoomDto.capacity,
      is_available: true,
    });

    const savedRoom = await this.roomRepository.save(room);

    const roomPrice = this.roomPriceRepository.create({
      room_price_id: uuidv4(),
      room_id: savedRoom.room_id,
      amount: createRoomDto.price,
      currency: createRoomDto.currency || 'USD',
    });
    await this.roomPriceRepository.save(roomPrice);

    if (createRoomDto.amenities && createRoomDto.amenities.length > 0) {
      const amenities = createRoomDto.amenities.map(name => 
        this.roomAmenityRepository.create({
          room_amenity_id: uuidv4(),
          room_id: savedRoom.room_id,
          name,
        })
      );
      await this.roomAmenityRepository.save(amenities);
    }

    if (createRoomDto.images && createRoomDto.images.length > 0) {
      const images = createRoomDto.images.map(url => 
        this.roomImageRepository.create({
          room_image_id: uuidv4(),
          room_id: savedRoom.room_id,
          url,
        })
      );
      await this.roomImageRepository.save(images);
    }

    return this.findOne(savedRoom.room_id);
  }

  async findByHotel(hotelId: string, params: PaginationParams & { type?: RoomType; minPrice?: number; maxPrice?: number; available?: boolean }): Promise<PaginatedResponse<RoomResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'room_number', sortOrder = 'asc', type, minPrice, maxPrice, available } = params;
    
    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.price', 'price')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect('room.images', 'images')
      .where('room.hotel_id = :hotelId', { hotelId });

    if (type) {
      queryBuilder.andWhere('room.room_type = :type', { type });
    }

    if (available !== undefined) {
      queryBuilder.andWhere('room.is_available = :available', { available });
    }

    if (minPrice) {
      queryBuilder.andWhere('price.amount >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('price.amount <= :maxPrice', { maxPrice });
    }

    queryBuilder
      .orderBy(`room.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [rooms, total] = await queryBuilder.getManyAndCount();

    const roomResponses = rooms.map(room => this.mapToRoomResponse(room));

    return PaginationUtil.createPaginatedResponse(roomResponses, total, params);
  }

  async findAll(params: PaginationParams & { 
    hotelId?: string;
    type?: RoomType; 
    minPrice?: number; 
    maxPrice?: number; 
    available?: boolean; 
  }): Promise<PaginatedResponse<RoomResponseDto>> {
    const { page = 1, limit = 10, hotelId, type, minPrice, maxPrice, available } = params;

    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.price', 'price')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect('room.images', 'images')
      .leftJoinAndSelect('room.hotel', 'hotel')
      .leftJoinAndSelect('hotel.address', 'address');

    if (hotelId) {
      queryBuilder.andWhere('room.hotel_id = :hotelId', { hotelId });
    }

    if (type) {
      queryBuilder.andWhere('room.room_type = :type', { type });
    }

    if (available !== undefined) {
      queryBuilder.andWhere('room.is_available = :available', { available });
    }

    if (minPrice) {
      queryBuilder.andWhere('price.amount >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('price.amount <= :maxPrice', { maxPrice });
    }

    queryBuilder
      .orderBy('room.created_at', 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [rooms, total] = await queryBuilder.getManyAndCount();

    const roomResponses = rooms.map(room => this.mapToRoomResponse(room));

    return PaginationUtil.createPaginatedResponse(roomResponses, total, params);
  }

  async getRoomAvailability(roomId: string, checkInDate: Date, checkOutDate: Date): Promise<{
    roomId: string;
    isAvailable: boolean;
    status: string;
    checkInDate: string;
    checkOutDate: string;
  }> {
    const room = await this.findOne(roomId);
    
    if (!room.isAvailable) {
      return {
        roomId,
        isAvailable: false,
        status: 'UNAVAILABLE',
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString()
      };
    }

    // Here you would normally check against a reservations table to see if the room
    // is booked for the requested dates. For now, we'll assume it's available
    // if the room's basic availability flag is true.
    
    // TODO: Implement actual reservation checking when reservation service is integrated
    return {
      roomId,
      isAvailable: true,
      status: 'AVAILABLE',
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString()
    };
  }

  async findOne(id: string): Promise<RoomResponseDto> {
    const room = await this.roomRepository.findOne({
      where: { room_id: id },
      relations: ['price', 'amenities', 'images', 'hotel']
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.mapToRoomResponse(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string, userRole: string): Promise<RoomResponseDto> {
    const room = await this.roomRepository.findOne({
      where: { room_id: id },
      relations: ['hotel', 'price', 'amenities', 'images']
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only update rooms in your own hotels');
    }

    if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.room_number) {
      const existingRoom = await this.roomRepository.findOne({
        where: { hotel_id: room.hotel_id, room_number: updateRoomDto.roomNumber }
      });

      if (existingRoom) {
        throw new ConflictException('Room number already exists in this hotel');
      }
    }

    await this.roomRepository.update(id, {
      room_number: updateRoomDto.roomNumber,
      room_type: updateRoomDto.roomType,
      capacity: updateRoomDto.capacity,
      is_available: updateRoomDto.isAvailable,
    });

    if (updateRoomDto.price !== undefined) {
      await this.roomPriceRepository.update(
        { room_id: id },
        {
          amount: updateRoomDto.price,
          currency: updateRoomDto.currency || 'USD',
        }
      );
    }

    if (updateRoomDto.amenities) {
      await this.roomAmenityRepository.delete({ room_id: id });
      if (updateRoomDto.amenities.length > 0) {
        const amenities = updateRoomDto.amenities.map(name => 
          this.roomAmenityRepository.create({
            room_amenity_id: uuidv4(),
            room_id: id,
            name,
          })
        );
        await this.roomAmenityRepository.save(amenities);
      }
    }

    if (updateRoomDto.images) {
      await this.roomImageRepository.delete({ room_id: id });
      if (updateRoomDto.images.length > 0) {
        const images = updateRoomDto.images.map(url => 
          this.roomImageRepository.create({
            room_image_id: uuidv4(),
            room_id: id,
            url,
          })
        );
        await this.roomImageRepository.save(images);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { room_id: id },
      relations: ['hotel']
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only delete rooms from your own hotels');
    }

    await this.roomRepository.remove(room);
  }

  async updateAvailability(roomId: string, isAvailable: boolean): Promise<void> {
    await this.roomRepository.update(roomId, { is_available: isAvailable });
  }

  async getAvailableRooms(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<RoomResponseDto[]> {
    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.price', 'price')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect('room.images', 'images')
      .where('room.hotel_id = :hotelId', { hotelId })
      .andWhere('room.is_available = :available', { available: true });

    // Here you would add logic to check against existing reservations
    // This would require access to the reservation service or database
    // For now, we'll just return available rooms

    const rooms = await queryBuilder.getMany();
    return rooms.map(room => this.mapToRoomResponse(room));
  }

  async searchAvailableRooms(params: {
    city?: string;
    country?: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    roomType?: RoomType;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
  } & PaginationParams): Promise<PaginatedResponse<RoomResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      country, 
      roomType, 
      minPrice, 
      maxPrice, 
      guests 
    } = params;

    const queryBuilder = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.price', 'price')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect('room.images', 'images')
      .leftJoinAndSelect('room.hotel', 'hotel')
      .leftJoinAndSelect('hotel.address', 'address')
      .where('room.is_available = :available', { available: true });

    if (city) {
      queryBuilder.andWhere('address.city LIKE :city', { city: `%${city}%` });
    }

    if (country) {
      queryBuilder.andWhere('address.country LIKE :country', { country: `%${country}%` });
    }

    if (roomType) {
      queryBuilder.andWhere('room.room_type = :roomType', { roomType });
    }

    if (minPrice) {
      queryBuilder.andWhere('price.amount >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('price.amount <= :maxPrice', { maxPrice });
    }

    if (guests) {
      queryBuilder.andWhere('room.capacity >= :guests', { guests });
    }

    queryBuilder
      .orderBy('price.amount', 'ASC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [rooms, total] = await queryBuilder.getManyAndCount();

    const roomResponses = rooms.map(room => this.mapToRoomResponse(room));

    return PaginationUtil.createPaginatedResponse(roomResponses, total, params);
  }

  private mapToRoomResponse(room: Room): RoomResponseDto {
    return {
      roomId: room.room_id,
      hotelId: room.hotel_id,
      roomNumber: room.room_number,
      roomType: room.room_type,
      capacity: room.capacity,
      isAvailable: !!room.is_available,
      price: room.price ? Number(room.price.amount) : 0,
      currency: room.price ? room.price.currency : 'USD',
      amenities: room.amenities ? room.amenities.map(a => a.name) : [],
      images: room.images ? room.images.map(i => i.url) : [],
      createdAt: room.created_at,
      updatedAt: room.updated_at,
    };
  }
}