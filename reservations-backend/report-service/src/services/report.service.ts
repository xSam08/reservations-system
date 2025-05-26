import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { 
  GenerateReportDto, 
  ReportResponseDto,
  ReportType,
  ReportFormat,
  ReservationReportData,
  RevenueReportData,
  OccupancyReportData,
  CustomerReportData,
  HotelPerformanceReportData
} from '../dto';
import { ApiResponse, PaginatedResponse } from '../common/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private reports: Map<string, ReportResponseDto> = new Map();

  async generateReport(dto: GenerateReportDto): Promise<ApiResponse<ReportResponseDto>> {
    try {
      const reportId = uuidv4();
      const report: ReportResponseDto = {
        id: reportId,
        type: dto.type,
        title: this.getReportTitle(dto.type),
        description: this.getReportDescription(dto.type, dto.startDate, dto.endDate),
        period: dto.period,
        startDate: dto.startDate,
        endDate: dto.endDate,
        hotelId: dto.hotelId,
        userId: dto.userId,
        format: dto.format || ReportFormat.JSON,
        status: 'GENERATING',
        createdAt: new Date(),
      };

      this.reports.set(reportId, report);

      // Simulate async report generation
      setTimeout(async () => {
        try {
          const reportData = await this.generateReportData(dto);
          report.data = reportData;
          report.status = 'COMPLETED';
          report.completedAt = new Date();
          
          if (dto.format !== ReportFormat.JSON) {
            report.downloadUrl = `/api/reports/${reportId}/download`;
          }

          this.reports.set(reportId, report);
          this.logger.log(`Report ${reportId} generated successfully`);
        } catch (error) {
          report.status = 'FAILED';
          report.error = error instanceof Error ? error.message : 'Unknown error';
          this.reports.set(reportId, report);
          this.logger.error(`Report ${reportId} generation failed:`, error);
        }
      }, 3000); // Simulate 3 second processing time

      this.logger.log(`Report generation started: ${reportId}`);

      return {
        success: true,
        message: 'Report generation started',
        data: report,
      };
    } catch (error) {
      this.logger.error('Failed to start report generation:', error);
      return {
        success: false,
        message: 'Failed to start report generation',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getReport(reportId: string): Promise<ApiResponse<ReportResponseDto>> {
    try {
      const report = this.reports.get(reportId);
      if (!report) {
        throw new NotFoundException('Report not found');
      }

      return {
        success: true,
        message: 'Report retrieved successfully',
        data: report,
      };
    } catch (error) {
      this.logger.error('Failed to get report:', error);
      return {
        success: false,
        message: 'Failed to retrieve report',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async getAllReports(): Promise<ApiResponse<ReportResponseDto[]>> {
    try {
      const reports = Array.from(this.reports.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return {
        success: true,
        message: 'Reports retrieved successfully',
        data: reports,
      };
    } catch (error) {
      this.logger.error('Failed to get reports:', error);
      return {
        success: false,
        message: 'Failed to retrieve reports',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async deleteReport(reportId: string): Promise<ApiResponse<void>> {
    try {
      const report = this.reports.get(reportId);
      if (!report) {
        throw new NotFoundException('Report not found');
      }

      this.reports.delete(reportId);

      this.logger.log(`Report deleted: ${reportId}`);

      return {
        success: true,
        message: 'Report deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete report:', error);
      return {
        success: false,
        message: 'Failed to delete report',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  private async generateReportData(dto: GenerateReportDto): Promise<any> {
    switch (dto.type) {
      case ReportType.RESERVATIONS:
        return this.generateReservationReport(dto);
      case ReportType.REVENUE:
        return this.generateRevenueReport(dto);
      case ReportType.OCCUPANCY:
        return this.generateOccupancyReport(dto);
      case ReportType.CUSTOMER:
        return this.generateCustomerReport(dto);
      case ReportType.HOTEL_PERFORMANCE:
        return this.generateHotelPerformanceReport(dto);
      case ReportType.PAYMENT:
        return this.generatePaymentReport(dto);
      default:
        throw new Error('Unsupported report type');
    }
  }

  private generateReservationReport(dto: GenerateReportDto): ReservationReportData {
    // Simulate data generation
    const days = this.getDaysBetween(new Date(dto.startDate), new Date(dto.endDate));
    
    return {
      totalReservations: 150,
      confirmedReservations: 120,
      cancelledReservations: 20,
      pendingReservations: 10,
      reservationsByDay: days.map(date => ({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 5000) + 1000,
      })),
      topHotels: [
        { hotelId: 'hotel-1', hotelName: 'Grand Plaza Hotel', reservations: 45, revenue: 22500 },
        { hotelId: 'hotel-2', hotelName: 'Ocean View Resort', reservations: 38, revenue: 19000 },
        { hotelId: 'hotel-3', hotelName: 'Mountain Lodge', reservations: 32, revenue: 16000 },
      ],
    };
  }

  private generateRevenueReport(dto: GenerateReportDto): RevenueReportData {
    const days = this.getDaysBetween(new Date(dto.startDate), new Date(dto.endDate));
    
    return {
      totalRevenue: 125000,
      paidRevenue: 115000,
      pendingRevenue: 8000,
      refundedRevenue: 2000,
      revenueByDay: days.map(date => ({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 8000) + 2000,
        payments: Math.floor(Math.random() * 15) + 5,
      })),
      revenueByHotel: [
        { hotelId: 'hotel-1', hotelName: 'Grand Plaza Hotel', revenue: 45000 },
        { hotelId: 'hotel-2', hotelName: 'Ocean View Resort', revenue: 38000 },
        { hotelId: 'hotel-3', hotelName: 'Mountain Lodge', revenue: 32000 },
      ],
      paymentMethods: [
        { method: 'CREDIT_CARD', count: 85, revenue: 85000 },
        { method: 'DEBIT_CARD', count: 35, revenue: 25000 },
        { method: 'PAYPAL', count: 20, revenue: 15000 },
      ],
    };
  }

  private generateOccupancyReport(dto: GenerateReportDto): OccupancyReportData {
    const days = this.getDaysBetween(new Date(dto.startDate), new Date(dto.endDate));
    
    return {
      averageOccupancyRate: 75.5,
      totalRooms: 500,
      occupiedRooms: 378,
      availableRooms: 122,
      occupancyByDay: days.map(date => ({
        date: date.toISOString().split('T')[0],
        occupancyRate: Math.floor(Math.random() * 40) + 60,
        occupiedRooms: Math.floor(Math.random() * 200) + 300,
        totalRooms: 500,
      })),
      occupancyByHotel: [
        { hotelId: 'hotel-1', hotelName: 'Grand Plaza Hotel', occupancyRate: 85.2, totalRooms: 150 },
        { hotelId: 'hotel-2', hotelName: 'Ocean View Resort', occupancyRate: 78.5, totalRooms: 200 },
        { hotelId: 'hotel-3', hotelName: 'Mountain Lodge', occupancyRate: 65.8, totalRooms: 150 },
      ],
    };
  }

  private generateCustomerReport(dto: GenerateReportDto): CustomerReportData {
    return {
      totalCustomers: 1250,
      newCustomers: 180,
      returningCustomers: 1070,
      customersByCountry: [
        { country: 'USA', count: 450 },
        { country: 'Canada', count: 200 },
        { country: 'Mexico', count: 150 },
        { country: 'UK', count: 120 },
        { country: 'Others', count: 330 },
      ],
      topCustomers: [
        { userId: 'user-1', userName: 'John Smith', reservations: 8, totalSpent: 12000 },
        { userId: 'user-2', userName: 'Sarah Johnson', reservations: 6, totalSpent: 9500 },
        { userId: 'user-3', userName: 'Mike Davis', reservations: 5, totalSpent: 7800 },
      ],
    };
  }

  private generateHotelPerformanceReport(dto: GenerateReportDto): HotelPerformanceReportData {
    return {
      totalHotels: 25,
      averageRating: 4.2,
      topRatedHotels: [
        { hotelId: 'hotel-1', hotelName: 'Grand Plaza Hotel', rating: 4.8, reviews: 245 },
        { hotelId: 'hotel-2', hotelName: 'Ocean View Resort', rating: 4.6, reviews: 189 },
        { hotelId: 'hotel-3', hotelName: 'Mountain Lodge', rating: 4.4, reviews: 156 },
      ],
      performanceMetrics: [
        { hotelId: 'hotel-1', hotelName: 'Grand Plaza Hotel', reservations: 45, revenue: 22500, occupancyRate: 85.2, averageRating: 4.8 },
        { hotelId: 'hotel-2', hotelName: 'Ocean View Resort', reservations: 38, revenue: 19000, occupancyRate: 78.5, averageRating: 4.6 },
        { hotelId: 'hotel-3', hotelName: 'Mountain Lodge', reservations: 32, revenue: 16000, occupancyRate: 65.8, averageRating: 4.4 },
      ],
    };
  }

  private generatePaymentReport(dto: GenerateReportDto): any {
    const days = this.getDaysBetween(new Date(dto.startDate), new Date(dto.endDate));
    
    return {
      totalPayments: 140,
      successfulPayments: 125,
      failedPayments: 10,
      pendingPayments: 5,
      totalAmount: 125000,
      paymentsByDay: days.map(date => ({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) + 3,
        amount: Math.floor(Math.random() * 8000) + 2000,
        successRate: Math.floor(Math.random() * 20) + 80,
      })),
    };
  }

  private getDaysBetween(startDate: Date, endDate: Date): Date[] {
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  private getReportTitle(type: ReportType): string {
    const titles = {
      [ReportType.RESERVATIONS]: 'Reservations Report',
      [ReportType.REVENUE]: 'Revenue Report',
      [ReportType.OCCUPANCY]: 'Occupancy Report',
      [ReportType.CUSTOMER]: 'Customer Report',
      [ReportType.HOTEL_PERFORMANCE]: 'Hotel Performance Report',
      [ReportType.PAYMENT]: 'Payment Report',
    };
    return titles[type];
  }

  private getReportDescription(type: ReportType, startDate: string, endDate: string): string {
    const typeDescriptions = {
      [ReportType.RESERVATIONS]: 'Detailed analysis of reservations',
      [ReportType.REVENUE]: 'Revenue and financial performance analysis',
      [ReportType.OCCUPANCY]: 'Room occupancy and utilization metrics',
      [ReportType.CUSTOMER]: 'Customer behavior and demographics analysis',
      [ReportType.HOTEL_PERFORMANCE]: 'Overall hotel performance metrics',
      [ReportType.PAYMENT]: 'Payment transactions and processing analysis',
    };
    
    return `${typeDescriptions[type]} for the period from ${startDate} to ${endDate}`;
  }
}