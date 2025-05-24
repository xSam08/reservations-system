import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('room_availability')
@Index('idx_room_date', ['roomId', 'date'])
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  availability_id: string;

  @Column('uuid')
  room_id: string;

  @Column('date')
  date: Date;

  @Column('int')
  available_rooms: number;

  @Column('int')
  total_rooms: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  base_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discounted_price: number;

  @Column('enum', { enum: ['AVAILABLE', 'LIMITED', 'UNAVAILABLE'], default: 'AVAILABLE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  get roomId(): string {
    return this.room_id;
  }

  set roomId(value: string) {
    this.room_id = value;
  }
}