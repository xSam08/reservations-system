import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Money {
  @ApiProperty({ description: 'Monetary amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Currency code (ISO 4217)', default: 'USD' })
  @Column({ default: 'USD' })
  currency: string;
}