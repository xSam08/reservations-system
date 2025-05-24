import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('hotel_photos')
export class HotelPhoto {
  @PrimaryGeneratedColumn('uuid')
  hotel_photo_id!: string;

  @Column()
  hotel_id!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Hotel, hotel => hotel.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;
}