import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('room_amenities')
export class RoomAmenity {
  @PrimaryGeneratedColumn('uuid')
  room_amenity_id!: string;

  @Column()
  room_id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Room, room => room.amenities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
}