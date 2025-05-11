import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User full name' })
  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'User phone number', required: false })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;
}