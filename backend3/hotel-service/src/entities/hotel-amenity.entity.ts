import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('hotel_amenities')
export class HotelAmenity {
  @PrimaryGeneratedColumn('uuid')
  hotel_amenity_id!: string;

  @Column()
  hotel_id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Hotel, hotel => hotel.amenities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;
}