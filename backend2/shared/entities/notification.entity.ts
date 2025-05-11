import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { NotificationType } from '../enums/notification-type.enum';

@Entity('notifications')
export class Notification extends BaseEntity {
  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @ApiProperty({ description: 'Notification message' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'Whether notification has been read', default: false })
  @Column({ default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Additional JSON data for the notification' })
  @Column('json', { nullable: true })
  data?: any;

  @ApiProperty({ description: 'User ID to whom the notification is sent' })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}