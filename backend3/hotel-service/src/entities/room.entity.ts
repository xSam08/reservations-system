import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { RoomType } from '../common/enums';
import { Hotel } from './hotel.entity';
import { RoomPrice } from './room-price.entity';
import { RoomAmenity } from './room-amenity.entity';
import { RoomImage } from './room-image.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  room_id!: string;

  @Column()
  hotel_id!: string;

  @Column()
  room_number!: string;

  @Column({
    type: 'enum',
    enum: RoomType
  })
  room_type!: RoomType;

  @Column()
  capacity!: number;

  @Column({ type: 'tinyint', default: 1 })
  is_available!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Hotel, hotel => hotel.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;

  @OneToOne(() => RoomPrice, price => price.room, { cascade: true, eager: true })
  price!: RoomPrice;

  @OneToMany(() => RoomAmenity, amenity => amenity.room, { cascade: true, eager: true })
  amenities!: RoomAmenity[];

  @OneToMany(() => RoomImage, image => image.room, { cascade: true, eager: true })
  images!: RoomImage[];
}