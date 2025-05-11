import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @ApiProperty({ description: 'Street address' })
  @Column()
  street: string;

  @ApiProperty({ description: 'City' })
  @Column()
  city: string;

  @ApiProperty({ description: 'State or province', required: false })
  @Column({ nullable: true })
  state?: string;

  @ApiProperty({ description: 'Country' })
  @Column()
  country: string;

  @ApiProperty({ description: 'ZIP or postal code', required: false })
  @Column({ nullable: true })
  zipCode?: string;
}