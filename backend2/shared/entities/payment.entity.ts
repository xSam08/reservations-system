import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Reservation } from './reservation.entity';
import { Money } from './money.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @ApiProperty({ description: 'Payment method' })
  @Column()
  method: string;

  @ApiProperty({ description: 'Payment status' })
  @Column()
  status: string;

  @ApiProperty({ description: 'Transaction ID (from payment provider)' })
  @Column({ nullable: true })
  transactionId?: string;

  @ApiProperty({ description: 'Payment date' })
  @Column({ type: 'datetime' })
  paymentDate: Date;

  @ApiProperty({ description: 'Reservation ID for this payment' })
  @Column()
  reservationId: string;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ApiProperty({ description: 'Amount information' })
  @Column(() => Money)
  amount: Money;
}