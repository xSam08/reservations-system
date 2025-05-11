import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Hotel } from './hotel.entity';
import { ReportType } from '../enums/report-type.enum';

@Entity('reports')
export class Report extends BaseEntity {
  @ApiProperty({ description: 'Report type', enum: ReportType })
  @Column({
    type: 'enum',
    enum: ReportType
  })
  type: ReportType;

  @ApiProperty({ description: 'Start date for the report period' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ description: 'End date for the report period' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ description: 'Report data in JSON format' })
  @Column('json', { nullable: true })
  data?: any;

  @ApiProperty({ description: 'Hotel ID for the report' })
  @Column()
  hotelId: string;

  @ManyToOne(() => Hotel)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;
}