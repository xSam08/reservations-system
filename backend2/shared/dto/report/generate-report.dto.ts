import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReportType } from '../../enums';

export class GenerateReportDto {
  @ApiProperty({ description: 'Report type', enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ description: 'Start date for the report period' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for the report period' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Hotel ID for the report' })
  @IsUUID()
  hotelId: string;
}