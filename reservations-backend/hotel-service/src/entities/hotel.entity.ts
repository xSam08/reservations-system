import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Address } from './address.entity';
import { HotelAmenity } from './hotel-amenity.entity';
import { HotelPhoto } from './hotel-photo.entity';
import { Room } from './room.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  hotel_id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column()
  owner_id!: string;

  @Column({ type: 'float', default: 0 })
  average_rating!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Address, address => address.hotel, { cascade: true, eager: true })
  address!: Address;

  @OneToMany(() => HotelAmenity, amenity => amenity.hotel, { cascade: true, eager: true })
  amenities!: HotelAmenity[];

  @OneToMany(() => HotelPhoto, photo => photo.hotel, { cascade: true, eager: true })
  photos!: HotelPhoto[];

  @OneToMany(() => Room, room => room.hotel)
  rooms!: Room[];
}