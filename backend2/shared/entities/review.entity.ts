import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Hotel } from './hotel.entity';
import { Reservation } from './reservation.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @ApiProperty({ description: 'Rating from 1-5 stars' })
  @Column()
  rating: number;

  @ApiProperty({ description: 'Review content' })
  @Column('text', { nullable: true })
  content?: string;

  @ApiProperty({ description: 'Customer ID who wrote the review' })
  @Column()
  customerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ApiProperty({ description: 'Hotel ID being reviewed' })
  @Column()
  hotelId: string;

  @ManyToOne(() => Hotel)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @ApiProperty({ description: 'Reservation ID associated with this review' })
  @Column({ nullable: true })
  reservationId?: string;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'reservationId' })
  reservation?: Reservation;
}