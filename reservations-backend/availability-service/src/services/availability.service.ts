import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Availability } from '../entities/availability.entity';
import { CreateAvailabilityDto, UpdateAvailabilityDto, CheckAvailabilityDto, AvailabilityResponseDto } from '../dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  async createAvailability(createAvailabilityDto: CreateAvailabilityDto): Promise<AvailabilityResponseDto> {
    const existingAvailability = await this.availabilityRepository.findOne({
      where: {
        room_id: createAvailabilityDto.roomId,
        date: new Date(createAvailabilityDto.date)
      }
    });

    if (existingAvailability) {
      throw new BadRequestException('Availability already exists for this room and date');
    }

    const availability = this.availabilityRepository.create({
      room_id: createAvailabilityDto.roomId,
      date: new Date(createAvailabilityDto.date),
      available_rooms: createAvailabilityDto.availableRooms,
      total_rooms: createAvailabilityDto.totalRooms,
      base_price: createAvailabilityDto.basePrice,
      discounted_price: createAvailabilityDto.discountedPrice,
      status: createAvailabilityDto.status || 'AVAILABLE'
    });

    const savedAvailability = await this.availabilityRepository.save(availability);
    return this.mapToResponse(savedAvailability);
  }

  async getAvailabilityByRoomAndDateRange(roomId: string, startDate: string, endDate: string): Promise<AvailabilityResponseDto[]> {
    const availability = await this.availabilityRepository.find({
      where: {
        room_id: roomId,
        date: Between(new Date(startDate), new Date(endDate))
      },
      order: { date: 'ASC' }
    });

    return availability.map(a => this.mapToResponse(a));
  }

  async checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<{ available: boolean; availabilityData: AvailabilityResponseDto[] }> {
    const { roomId, checkInDate, checkOutDate } = checkAvailabilityDto;
    
    const availability = await this.getAvailabilityByRoomAndDateRange(roomId, checkInDate, checkOutDate);
    
    const available = availability.length > 0 && availability.every(a => a.availableRooms > 0 && a.status !== 'UNAVAILABLE');
    
    return {
      available,
      availabilityData: availability
    };
  }

  async updateAvailability(availabilityId: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<AvailabilityResponseDto> {
    const availability = await this.availabilityRepository.findOne({
      where: { availability_id: availabilityId }
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    const updatedAvailability = await this.availabilityRepository.save({
      ...availability,
      ...updateAvailabilityDto,
      updated_at: new Date()
    });

    return this.mapToResponse(updatedAvailability);
  }

  async reduceAvailability(roomId: string, date: string, quantity: number = 1): Promise<AvailabilityResponseDto> {
    const availability = await this.availabilityRepository.findOne({
      where: {
        room_id: roomId,
        date: new Date(date)
      }
    });

    if (!availability) {
      throw new NotFoundException('Availability not found for the specified room and date');
    }

    if (availability.available_rooms < quantity) {
      throw new BadRequestException('Insufficient available rooms');
    }

    availability.available_rooms -= quantity;
    
    if (availability.available_rooms === 0) {
      availability.status = 'UNAVAILABLE';
    } else if (availability.available_rooms <= availability.total_rooms * 0.2) {
      availability.status = 'LIMITED';
    }

    const updatedAvailability = await this.availabilityRepository.save(availability);
    return this.mapToResponse(updatedAvailability);
  }

  async restoreAvailability(roomId: string, date: string, quantity: number = 1): Promise<AvailabilityResponseDto> {
    const availability = await this.availabilityRepository.findOne({
      where: {
        room_id: roomId,
        date: new Date(date)
      }
    });

    if (!availability) {
      throw new NotFoundException('Availability not found for the specified room and date');
    }

    availability.available_rooms = Math.min(availability.available_rooms + quantity, availability.total_rooms);
    
    if (availability.available_rooms > availability.total_rooms * 0.2) {
      availability.status = 'AVAILABLE';
    } else if (availability.available_rooms > 0) {
      availability.status = 'LIMITED';
    }

    const updatedAvailability = await this.availabilityRepository.save(availability);
    return this.mapToResponse(updatedAvailability);
  }

  async deleteAvailability(availabilityId: string): Promise<void> {
    const result = await this.availabilityRepository.delete(availabilityId);
    if (result.affected === 0) {
      throw new NotFoundException('Availability not found');
    }
  }

  private mapToResponse(availability: Availability): AvailabilityResponseDto {
    return {
      availabilityId: availability.availability_id,
      roomId: availability.room_id,
      date: availability.date,
      availableRooms: availability.available_rooms,
      totalRooms: availability.total_rooms,
      basePrice: availability.base_price,
      discountedPrice: availability.discounted_price,
      status: availability.status,
      createdAt: availability.created_at,
      updatedAt: availability.updated_at
    };
  }
}