import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto, UpdateReservationDto, ReservationFilterDto } from '../dto/reservation.dto';
import { ReservationStatus } from '../enums/reservation.enum';
import axios from 'axios';

@Injectable()
export class ReservationService {
  private readonly availabilityServiceUrl = process.env.AVAILABILITY_SERVICE_URL || 'http://localhost:3005';

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(filterDto: ReservationFilterDto) {
    const { page = 1, limit = 10, status, hotelId, customerId, fromDate, toDate } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reservationRepository.createQueryBuilder('reservation');

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (hotelId) {
      queryBuilder.andWhere('reservation.hotelId = :hotelId', { hotelId });
    }

    if (customerId) {
      queryBuilder.andWhere('reservation.customerId = :customerId', { customerId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('reservation.checkInDate BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    } else if (fromDate) {
      queryBuilder.andWhere('reservation.checkInDate >= :fromDate', { fromDate });
    } else if (toDate) {
      queryBuilder.andWhere('reservation.checkInDate <= :toDate', { toDate });
    }

    queryBuilder
      .orderBy('reservation.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [reservations, total] = await queryBuilder.getManyAndCount();

    return {
      data: reservations.map(this.mapToResponseDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPending(filterDto: ReservationFilterDto) {
    const modifiedFilter = { ...filterDto, status: ReservationStatus.PENDING };
    return this.findAll(modifiedFilter);
  }

  async findHistory(filterDto: ReservationFilterDto, userId?: string) {
    const queryBuilder = this.reservationRepository.createQueryBuilder('reservation');
    
    queryBuilder.andWhere('reservation.status IN (:...statuses)', {
      statuses: [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED]
    });

    if (userId) {
      queryBuilder.andWhere('reservation.customerId = :userId', { userId });
    }

    const { page = 1, limit = 10, hotelId, fromDate, toDate } = filterDto;
    const skip = (page - 1) * limit;

    if (hotelId) {
      queryBuilder.andWhere('reservation.hotelId = :hotelId', { hotelId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('reservation.checkInDate BETWEEN :fromDate AND :toDate', { fromDate, toDate });
    }

    queryBuilder
      .orderBy('reservation.updatedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [reservations, total] = await queryBuilder.getManyAndCount();

    return {
      data: reservations.map(this.mapToResponseDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: string, filterDto: ReservationFilterDto) {
    const modifiedFilter = { ...filterDto, customerId: userId };
    return this.findAll(modifiedFilter);
  }

  async findByHotelId(hotelId: string, filterDto: ReservationFilterDto) {
    const modifiedFilter = { ...filterDto, hotelId };
    return this.findAll(modifiedFilter);
  }

  async findById(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.mapToResponseDto(reservation);
  }

  async create(createReservationDto: CreateReservationDto, customerId: string) {
    const { hotelId, roomId, checkInDate, checkOutDate, guestCount, specialRequests } = createReservationDto;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Check room availability using availability service
    try {
      const availabilityResponse = await axios.post(`${this.availabilityServiceUrl}/availability/check`, {
        roomId,
        checkInDate: checkIn.toISOString().split('T')[0],
        checkOutDate: checkOut.toISOString().split('T')[0]
      });

      if (!availabilityResponse.data.success || !availabilityResponse.data.data.available) {
        throw new ConflictException('Room is not available for the selected dates');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Fallback to database check if availability service is down
      const conflictingReservations = await this.reservationRepository.createQueryBuilder('reservation')
        .where('reservation.roomId = :roomId', { roomId })
        .andWhere('reservation.status NOT IN (:...statuses)', { 
          statuses: [ReservationStatus.CANCELLED, ReservationStatus.REJECTED] 
        })
        .andWhere(`
          (reservation.checkInDate <= :checkOutDate AND reservation.checkOutDate >= :checkInDate)
        `, { checkInDate, checkOutDate })
        .getMany();

      if (conflictingReservations.length > 0) {
        throw new ConflictException('Room is not available for the selected dates');
      }
    }

    // Calculate price (simplified - should integrate with room pricing)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = 100; // This should come from room service
    const totalAmount = basePrice * nights;

    const reservation = this.reservationRepository.create({
      customerId,
      hotelId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestCount,
      specialRequests,
      totalAmount,
      currency: 'USD',
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationRepository.save(reservation);
    
    // Reduce availability for each day in the date range
    try {
      await this.updateAvailabilityForReservation(roomId, checkIn, checkOut, 'reduce');
    } catch (error) {
      console.error('Failed to update availability after reservation creation:', error);
      // Don't fail the reservation if availability service is down, but log it
    }
    
    return this.mapToResponseDto(savedReservation);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Only allow updates if reservation is still pending or confirmed
    if (![ReservationStatus.PENDING, ReservationStatus.CONFIRMED].includes(reservation.status)) {
      throw new BadRequestException('Cannot update reservation in current status');
    }

    // Validate date changes if provided
    if (updateReservationDto.checkInDate || updateReservationDto.checkOutDate) {
      const checkInDate = updateReservationDto.checkInDate ? 
        new Date(updateReservationDto.checkInDate) : reservation.checkInDate;
      const checkOutDate = updateReservationDto.checkOutDate ? 
        new Date(updateReservationDto.checkOutDate) : reservation.checkOutDate;

      if (checkOutDate <= checkInDate) {
        throw new BadRequestException('Check-out date must be after check-in date');
      }

      // Check for conflicts if dates are changing
      if (updateReservationDto.checkInDate || updateReservationDto.checkOutDate) {
        const conflictingReservations = await this.reservationRepository.createQueryBuilder('reservation')
          .where('reservation.roomId = :roomId', { roomId: reservation.roomId })
          .andWhere('reservation.reservationId != :reservationId', { reservationId: id })
          .andWhere('reservation.status NOT IN (:...statuses)', { 
            statuses: [ReservationStatus.CANCELLED, ReservationStatus.REJECTED] 
          })
          .andWhere(`
            (reservation.checkInDate <= :checkOutDate AND reservation.checkOutDate >= :checkInDate)
          `, { checkInDate: checkInDate.toISOString().split('T')[0], checkOutDate: checkOutDate.toISOString().split('T')[0] })
          .getMany();

        if (conflictingReservations.length > 0) {
          throw new ConflictException('Room is not available for the updated dates');
        }
      }
    }

    Object.assign(reservation, updateReservationDto);
    const updatedReservation = await this.reservationRepository.save(reservation);
    return this.mapToResponseDto(updatedReservation);
  }

  async updateStatus(id: string, status: ReservationStatus, reason?: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = status;
    if (reason && status === ReservationStatus.CANCELLED) {
      reservation.cancellationReason = reason;
    }

    const updatedReservation = await this.reservationRepository.save(reservation);
    return this.mapToResponseDto(updatedReservation);
  }

  async confirm(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    const updatedReservation = await this.reservationRepository.save(reservation);
    return this.mapToResponseDto(updatedReservation);
  }

  async reject(id: string, reason?: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be rejected');
    }

    reservation.status = ReservationStatus.REJECTED;
    if (reason) {
      reservation.cancellationReason = reason;
    }

    const updatedReservation = await this.reservationRepository.save(reservation);
    return this.mapToResponseDto(updatedReservation);
  }

  async cancel(id: string, reason: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (![ReservationStatus.PENDING, ReservationStatus.CONFIRMED].includes(reservation.status)) {
      throw new BadRequestException('Only pending or confirmed reservations can be cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;
    reservation.cancellationReason = reason;

    const updatedReservation = await this.reservationRepository.save(reservation);
    
    // Restore availability when reservation is cancelled
    try {
      await this.updateAvailabilityForReservation(
        reservation.roomId, 
        reservation.checkInDate, 
        reservation.checkOutDate, 
        'restore'
      );
    } catch (error) {
      console.error('Failed to update availability after reservation cancellation:', error);
    }
    
    return this.mapToResponseDto(updatedReservation);
  }

  async delete(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationRepository.remove(reservation);
  }

  private async updateAvailabilityForReservation(
    roomId: string, 
    checkInDate: Date, 
    checkOutDate: Date, 
    action: 'reduce' | 'restore'
  ): Promise<void> {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    
    // Loop through each day in the date range
    for (let currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      try {
        if (action === 'reduce') {
          await axios.post(`${this.availabilityServiceUrl}/availability/reduce/${roomId}/${dateString}?quantity=1`);
        } else if (action === 'restore') {
          await axios.post(`${this.availabilityServiceUrl}/availability/restore/${roomId}/${dateString}?quantity=1`);
        }
      } catch (error) {
        console.error(`Failed to ${action} availability for room ${roomId} on ${dateString}:`, error.message);
        // Continue with other dates even if one fails
      }
    }
  }

  private mapToResponseDto(reservation: Reservation) {
    return {
      reservationId: reservation.reservationId,
      customerId: reservation.customerId,
      hotelId: reservation.hotelId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      status: reservation.status,
      guestCount: reservation.guestCount,
      totalPrice: {
        amount: parseFloat(reservation.totalAmount.toString()),
        currency: reservation.currency,
      },
      specialRequests: reservation.specialRequests,
      cancellationReason: reservation.cancellationReason,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }
}