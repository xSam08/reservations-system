import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Hotel } from './hotel.entity';
import { Room } from './room.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { Money } from './money.entity';

@Entity('reservations')
export class Reservation extends BaseEntity {
  @ApiProperty({ description: 'Check-in date' })
  @Column({ type: 'date' })
  checkInDate: Date;

  @ApiProperty({ description: 'Check-out date' })
  @Column({ type: 'date' })
  checkOutDate: Date;

  @ApiProperty({ description: 'Number of guests' })
  @Column()
  guestCount: number;

  @ApiProperty({ description: 'Reservation status', enum: ReservationStatus })
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING
  })
  status: ReservationStatus;

  @ApiProperty({ description: 'Customer ID who made the reservation' })
  @Column()
  customerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ApiProperty({ description: 'Hotel ID for the reservation' })
  @Column()
  hotelId: string;

  @ManyToOne(() => Hotel)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @ApiProperty({ description: 'Room ID for the reservation' })
  @Column()
  roomId: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ApiProperty({ description: 'Total price information' })
  @Column(() => Money)
  totalPrice: Money;
}