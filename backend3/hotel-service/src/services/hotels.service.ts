import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../entities/hotel.entity';
import { Address } from '../entities/address.entity';
import { HotelAmenity } from '../entities/hotel-amenity.entity';
import { HotelPhoto } from '../entities/hotel-photo.entity';
import { CreateHotelDto, UpdateHotelDto, HotelResponseDto } from '../dto';
import { UserRole } from '../common/enums';
import { PaginationParams, PaginatedResponse } from '../common/types';
import { PaginationUtil } from '../common/pagination.util';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(HotelAmenity)
    private hotelAmenityRepository: Repository<HotelAmenity>,
    @InjectRepository(HotelPhoto)
    private hotelPhotoRepository: Repository<HotelPhoto>,
  ) {}

  async create(createHotelDto: CreateHotelDto, ownerId: string): Promise<HotelResponseDto> {
    const hotel = this.hotelRepository.create({
      hotel_id: uuidv4(),
      name: createHotelDto.name,
      description: createHotelDto.description,
      owner_id: ownerId,
    });

    const savedHotel = await this.hotelRepository.save(hotel);

    const address = this.addressRepository.create({
      address_id: uuidv4(),
      hotel_id: savedHotel.hotel_id,
      street: createHotelDto.address.street,
      city: createHotelDto.address.city,
      state: createHotelDto.address.state,
      country: createHotelDto.address.country,
      zip_code: createHotelDto.address.zipCode,
    });
    await this.addressRepository.save(address);

    if (createHotelDto.amenities && createHotelDto.amenities.length > 0) {
      const amenities = createHotelDto.amenities.map(name => 
        this.hotelAmenityRepository.create({
          hotel_amenity_id: uuidv4(),
          hotel_id: savedHotel.hotel_id,
          name,
        })
      );
      await this.hotelAmenityRepository.save(amenities);
    }

    if (createHotelDto.photos && createHotelDto.photos.length > 0) {
      const photos = createHotelDto.photos.map(url => 
        this.hotelPhotoRepository.create({
          hotel_photo_id: uuidv4(),
          hotel_id: savedHotel.hotel_id,
          url,
        })
      );
      await this.hotelPhotoRepository.save(photos);
    }

    return this.findOne(savedHotel.hotel_id);
  }

  async findAll(params: PaginationParams & { city?: string; country?: string; minPrice?: number; maxPrice?: number }): Promise<PaginatedResponse<HotelResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', city, country, minPrice, maxPrice } = params;
    
    const queryBuilder = this.hotelRepository.createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.address', 'address')
      .leftJoinAndSelect('hotel.amenities', 'amenities')
      .leftJoinAndSelect('hotel.photos', 'photos')
      .leftJoinAndSelect('hotel.rooms', 'rooms')
      .leftJoinAndSelect('rooms.price', 'roomPrice');

    if (city) {
      queryBuilder.andWhere('address.city LIKE :city', { city: `%${city}%` });
    }

    if (country) {
      queryBuilder.andWhere('address.country LIKE :country', { country: `%${country}%` });
    }

    if (minPrice) {
      queryBuilder.andWhere('roomPrice.amount >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('roomPrice.amount <= :maxPrice', { maxPrice });
    }

    queryBuilder
      .orderBy(`hotel.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [hotels, total] = await queryBuilder.getManyAndCount();

    const hotelResponses = hotels.map(hotel => this.mapToHotelResponse(hotel));

    return PaginationUtil.createPaginatedResponse(hotelResponses, total, params);
  }

  async findOne(id: string): Promise<HotelResponseDto> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: id },
      relations: ['address', 'amenities', 'photos', 'rooms', 'rooms.price']
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return this.mapToHotelResponse(hotel);
  }

  async findByOwner(ownerId: string, params: PaginationParams): Promise<PaginatedResponse<HotelResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
    
    const queryBuilder = this.hotelRepository.createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.address', 'address')
      .leftJoinAndSelect('hotel.amenities', 'amenities')
      .leftJoinAndSelect('hotel.photos', 'photos')
      .where('hotel.owner_id = :ownerId', { ownerId })
      .orderBy(`hotel.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [hotels, total] = await queryBuilder.getManyAndCount();

    const hotelResponses = hotels.map(hotel => this.mapToHotelResponse(hotel));

    return PaginationUtil.createPaginatedResponse(hotelResponses, total, params);
  }

  async update(id: string, updateHotelDto: UpdateHotelDto, userId: string, userRole: string): Promise<HotelResponseDto> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: id },
      relations: ['address', 'amenities', 'photos']
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only update your own hotels');
    }

    await this.hotelRepository.update(id, {
      name: updateHotelDto.name,
      description: updateHotelDto.description,
    });

    if (updateHotelDto.address) {
      await this.addressRepository.update(
        { hotel_id: id },
        {
          street: updateHotelDto.address.street,
          city: updateHotelDto.address.city,
          state: updateHotelDto.address.state,
          country: updateHotelDto.address.country,
          zip_code: updateHotelDto.address.zipCode,
        }
      );
    }

    if (updateHotelDto.amenities) {
      await this.hotelAmenityRepository.delete({ hotel_id: id });
      if (updateHotelDto.amenities.length > 0) {
        const amenities = updateHotelDto.amenities.map(name => 
          this.hotelAmenityRepository.create({
            hotel_amenity_id: uuidv4(),
            hotel_id: id,
            name,
          })
        );
        await this.hotelAmenityRepository.save(amenities);
      }
    }

    if (updateHotelDto.photos) {
      await this.hotelPhotoRepository.delete({ hotel_id: id });
      if (updateHotelDto.photos.length > 0) {
        const photos = updateHotelDto.photos.map(url => 
          this.hotelPhotoRepository.create({
            hotel_photo_id: uuidv4(),
            hotel_id: id,
            url,
          })
        );
        await this.hotelPhotoRepository.save(photos);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: id }
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only delete your own hotels');
    }

    await this.hotelRepository.remove(hotel);
  }

  async search(query: string, params: PaginationParams): Promise<PaginatedResponse<HotelResponseDto>> {
    const { page = 1, limit = 10 } = params;
    
    const queryBuilder = this.hotelRepository.createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.address', 'address')
      .leftJoinAndSelect('hotel.amenities', 'amenities')
      .leftJoinAndSelect('hotel.photos', 'photos')
      .where('hotel.name LIKE :query', { query: `%${query}%` })
      .orWhere('hotel.description LIKE :query', { query: `%${query}%` })
      .orWhere('address.city LIKE :query', { query: `%${query}%` })
      .orWhere('address.country LIKE :query', { query: `%${query}%` })
      .orderBy('hotel.average_rating', 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [hotels, total] = await queryBuilder.getManyAndCount();

    const hotelResponses = hotels.map(hotel => this.mapToHotelResponse(hotel));

    return PaginationUtil.createPaginatedResponse(hotelResponses, total, params);
  }

  async getHotelRooms(hotelId: string, params: PaginationParams & { available?: boolean }): Promise<PaginatedResponse<any>> {
    // In a real implementation, this would query the room service or room table
    // For now, return mock data structure
    const { page = 1, limit = 10 } = params;
    
    // Verify hotel exists
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: hotelId }
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // Mock room data (in real implementation, would query rooms table)
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }

  async getHotelReservations(hotelId: string, userId: string, userRole: string, params: PaginationParams & { status?: string }): Promise<PaginatedResponse<any>> {
    // Verify hotel exists and user has permission
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: hotelId }
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only view reservations for your own hotels');
    }

    // In a real implementation, this would query the reservation service
    const { page = 1, limit = 10 } = params;
    
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }

  async getHotelStatistics(hotelId: string, userId: string, userRole: string): Promise<any> {
    // Verify hotel exists and user has permission
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: hotelId },
      relations: ['rooms']
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.owner_id !== userId && userRole !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('You can only view statistics for your own hotels');
    }

    // Basic statistics from hotel data
    // In a real implementation, would aggregate data from reservations, reviews, etc.
    return {
      hotelId: hotel.hotel_id,
      totalRooms: hotel.rooms?.length || 0,
      averageRating: hotel.average_rating || 0,
      totalReservations: 0, // Would come from reservation service
      occupancyRate: 0, // Would be calculated from reservations
      revenue: {
        thisMonth: 0,
        lastMonth: 0,
        thisYear: 0
      },
      reviewStats: {
        totalReviews: 0,
        averageRating: hotel.average_rating || 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      },
      topAmenities: hotel.amenities?.slice(0, 5).map(a => a.name) || []
    };
  }

  async updateHotelStatus(hotelId: string, status: 'active' | 'inactive' | 'suspended'): Promise<HotelResponseDto> {
    const hotel = await this.hotelRepository.findOne({
      where: { hotel_id: hotelId }
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    // Add status field to hotel (in real implementation, might be a separate field)
    await this.hotelRepository.save({
      ...hotel,
      // status field would be added to Hotel entity
      updated_at: new Date()
    });

    return this.findOne(hotelId);
  }

  async updateRating(hotelId: string, rating: number): Promise<void> {
    await this.hotelRepository.update(hotelId, { average_rating: rating });
  }

  private mapToHotelResponse(hotel: Hotel): HotelResponseDto {
    return {
      hotelId: hotel.hotel_id,
      name: hotel.name,
      description: hotel.description,
      ownerId: hotel.owner_id,
      averageRating: hotel.average_rating,
      address: hotel.address ? {
        street: hotel.address.street,
        city: hotel.address.city,
        state: hotel.address.state,
        country: hotel.address.country,
        zipCode: hotel.address.zip_code,
      } : undefined,
      amenities: hotel.amenities ? hotel.amenities.map(a => a.name) : [],
      photos: hotel.photos ? hotel.photos.map(p => p.url) : [],
      createdAt: hotel.created_at,
      updatedAt: hotel.updated_at,
    };
  }
}