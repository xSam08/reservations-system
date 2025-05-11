import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Hotel } from './hotel.entity';
import { RoomType } from '../enums/room-type.enum';
import { Money } from './money.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @ApiProperty({ description: 'Room number in the hotel' })
  @Column()
  roomNumber: string;

  @ApiProperty({ description: 'Room type', enum: RoomType })
  @Column({
    type: 'enum',
    enum: RoomType
  })
  roomType: RoomType;

  @ApiProperty({ description: 'Maximum capacity of guests' })
  @Column()
  capacity: number;

  @ApiProperty({ description: 'Hotel ID that the room belongs to' })
  @Column()
  hotelId: string;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @ApiProperty({ description: 'Price information' })
  @Column(() => Money)
  price: Money;

  @ApiProperty({ description: 'Whether the room is available for booking' })
  @Column({ default: true })
  isAvailable: boolean;
}