import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('room_images')
export class RoomImage {
  @PrimaryGeneratedColumn('uuid')
  room_image_id!: string;

  @Column()
  room_id!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Room, room => room.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
}