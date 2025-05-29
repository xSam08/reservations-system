import { IsString, IsOptional, IsDateString, IsEnum, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportType {
  RESERVATIONS = 'RESERVATIONS',
  REVENUE = 'REVENUE',
  OCCUPANCY = 'OCCUPANCY',
  CUSTOMER = 'CUSTOMER',
  HOTEL_PERFORMANCE = 'HOTEL_PERFORMANCE',
  PAYMENT = 'PAYMENT'
}

export enum ReportFormat {
  JSON = 'JSON',
  CSV = 'CSV',
  PDF = 'PDF'
}

export enum TimePeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export class GenerateReportDto {
  @ApiProperty({ description: 'Report type', enum: ReportType, example: ReportType.RESERVATIONS })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ description: 'Time period for report', enum: TimePeriod, example: TimePeriod.MONTHLY })
  @IsEnum(TimePeriod)
  period: TimePeriod;

  @ApiProperty({ description: 'Report start date', example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Report end date', example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Hotel ID filter', example: '507f1f77bcf86cd799439013' })
  @IsOptional()
  @IsUUID()
  hotelId?: string;

  @ApiPropertyOptional({ description: 'User ID filter', example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Report format', enum: ReportFormat, default: ReportFormat.JSON })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat = ReportFormat.JSON;

  @ApiPropertyOptional({ description: 'Additional filters', example: ['confirmed', 'paid'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filters?: string[];
}

export class ReportResponseDto {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  period: TimePeriod;
  startDate: string;
  endDate: string;
  hotelId?: string;
  userId?: string;
  format: ReportFormat;
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  data?: any;
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export class ReservationReportData {
  totalReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  pendingReservations: number;
  reservationsByDay: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  topHotels: Array<{
    hotelId: string;
    hotelName: string;
    reservations: number;
    revenue: number;
  }>;
}

export class RevenueReportData {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  refundedRevenue: number;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    payments: number;
  }>;
  revenueByHotel: Array<{
    hotelId: string;
    hotelName: string;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
}

export class OccupancyReportData {
  averageOccupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyByDay: Array<{
    date: string;
    occupancyRate: number;
    occupiedRooms: number;
    totalRooms: number;
  }>;
  occupancyByHotel: Array<{
    hotelId: string;
    hotelName: string;
    occupancyRate: number;
    totalRooms: number;
  }>;
}

export class CustomerReportData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customersByCountry: Array<{
    country: string;
    count: number;
  }>;
  topCustomers: Array<{
    userId: string;
    userName: string;
    reservations: number;
    totalSpent: number;
  }>;
}

export class HotelPerformanceReportData {
  totalHotels: number;
  averageRating: number;
  topRatedHotels: Array<{
    hotelId: string;
    hotelName: string;
    rating: number;
    reviews: number;
  }>;
  performanceMetrics: Array<{
    hotelId: string;
    hotelName: string;
    reservations: number;
    revenue: number;
    occupancyRate: number;
    averageRating: number;
  }>;
}