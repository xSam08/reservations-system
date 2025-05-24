import { IsNotEmpty, IsEnum, IsString, IsDateString, IsOptional } from 'class-validator';
import { ReportType } from '../enums';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  data?: any;
}

export class ReportResponseDto {
  reportId: string;
  hotelId: string;
  type: ReportType;
  startDate: Date;
  endDate: Date;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}