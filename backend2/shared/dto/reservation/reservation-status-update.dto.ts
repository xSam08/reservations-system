import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../../enums';

export class ReservationStatusUpdateDto {
  @ApiProperty({ description: 'New reservation status', enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiProperty({ description: 'Status change message/reason (optional)', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}