import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { GenerateReportDto, ReportResponseDto } from '../dto';
import { ApiResponse as CustomApiResponse } from '../common/types';

@ApiTags('Reports')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for report service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): CustomApiResponse<any> {
    return {
      success: true,
      message: 'Report service is healthy',
      data: {
        service: 'report-service',
        status: 'OK',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new report' })
  @ApiResponse({ status: 201, description: 'Report generation started' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async generateReport(@Body() dto: GenerateReportDto): Promise<CustomApiResponse<ReportResponseDto>> {
    return await this.reportService.generateReport(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async getAllReports(): Promise<CustomApiResponse<ReportResponseDto[]>> {
    return await this.reportService.getAllReports();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getReport(@Param('id') id: string): Promise<CustomApiResponse<ReportResponseDto>> {
    return await this.reportService.getReport(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete report' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async deleteReport(@Param('id') id: string): Promise<CustomApiResponse<void>> {
    return await this.reportService.deleteReport(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download report file' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report file download' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async downloadReport(@Param('id') id: string): Promise<CustomApiResponse<any>> {
    // In a real implementation, this would serve the actual file
    return {
      success: true,
      message: 'Report download ready',
      data: {
        reportId: id,
        downloadUrl: `/api/reports/${id}/download`,
        note: 'In production, this would serve the actual file (PDF/CSV)',
      },
    };
  }

  @Get('types/available')
  @ApiOperation({ summary: 'Get available report types' })
  @ApiResponse({ status: 200, description: 'Available report types' })
  getAvailableReportTypes(): CustomApiResponse<any> {
    return {
      success: true,
      message: 'Available report types retrieved',
      data: {
        types: [
          { 
            key: 'RESERVATIONS', 
            name: 'Reservations Report', 
            description: 'Detailed analysis of reservations and booking patterns' 
          },
          { 
            key: 'REVENUE', 
            name: 'Revenue Report', 
            description: 'Financial performance and revenue analysis' 
          },
          { 
            key: 'OCCUPANCY', 
            name: 'Occupancy Report', 
            description: 'Room occupancy rates and utilization metrics' 
          },
          { 
            key: 'CUSTOMER', 
            name: 'Customer Report', 
            description: 'Customer demographics and behavior analysis' 
          },
          { 
            key: 'HOTEL_PERFORMANCE', 
            name: 'Hotel Performance Report', 
            description: 'Overall performance metrics for hotels' 
          },
          { 
            key: 'PAYMENT', 
            name: 'Payment Report', 
            description: 'Payment processing and transaction analysis' 
          },
        ],
        formats: ['JSON', 'CSV', 'PDF'],
        periods: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM'],
      },
    };
  }
}