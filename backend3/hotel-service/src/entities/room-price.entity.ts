import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('room_prices')
export class RoomPrice {
  @PrimaryGeneratedColumn('uuid')
  room_price_id!: string;

  @Column()
  room_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @OneToOne(() => Room, room => room.price)
  @JoinColumn({ name: 'room_id' })
  room!: Room;
}