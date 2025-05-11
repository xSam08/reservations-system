import { Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Address } from './address.entity';

@Entity('hotels')
export class Hotel extends BaseEntity {
  @ApiProperty({ description: 'Hotel name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Hotel description' })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Average rating from 0-5', default: 0 })
  @Column('float', { default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Hotel owner ID' })
  @Column()
  ownerId: string;

  @ManyToOne(() => User)
  owner: User;

  @ApiProperty({ description: 'Address ID' })
  @Column({ nullable: true })
  addressId?: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn({ name: 'addressId' })
  address?: Address;
}