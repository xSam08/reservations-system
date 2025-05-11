import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DailyAvailabilityDto {
  @ApiProperty({ description: 'Date' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Is the room available on this date' })
  available: boolean;
}

export class GetRoomAvailabilityDto {
  @ApiProperty({ description: 'Start date for availability check' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for availability check' })
  @IsDateString()
  endDate: string;
}

export class RoomAvailabilityResponseDto {
  @ApiProperty({ description: 'Room ID' })
  roomId: string;

  @ApiProperty({ description: 'Room number' })
  roomNumber: string;

  @ApiProperty({ description: 'Room type' })
  roomType: string;

  @ApiProperty({ description: 'Day by day availability' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  availability: DailyAvailabilityDto[];
}