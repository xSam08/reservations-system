import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  address_id!: string;

  @Column()
  hotel_id!: string;

  @Column()
  street!: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  state!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  zip_code!: string;

  @OneToOne(() => Hotel, hotel => hotel.address)
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;
}