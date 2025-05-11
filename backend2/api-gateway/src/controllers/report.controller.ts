import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Query, Param, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole, ReportType } from '@app/shared';
import { GenerateReportDto } from '@app/shared/dto/report/generate-report.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(
    @Inject('REPORT_SERVICE') private readonly reportServiceClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports for the current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all reports' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findAll(@Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'findAll' }, 
          { userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching reports');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the report' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Report not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const report = await firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'findOne' }, 
          { id, userId, userRole }
        )
      );
      
      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      
      return report;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching report');
    }
  }

  @Get('hotel/:hotelId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports for a specific hotel' })
  @ApiParam({ name: 'hotelId', description: 'Hotel ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns hotel reports' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findByHotel(@Param('hotelId') hotelId: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'findByHotel' }, 
          { hotelId, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching hotel reports');
    }
  }

  @Get('types/occupancy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate occupancy report for a hotel' })
  @ApiQuery({ name: 'hotelId', description: 'Hotel ID', required: true })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', required: true })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns occupancy report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async generateOccupancyReport(
    @Query('hotelId') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const reportDto: GenerateReportDto = {
        type: ReportType.OCCUPANCY,
        hotelId,
        startDate,
        endDate
      };
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'generateReport' }, 
          { reportDto, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error generating occupancy report');
    }
  }

  @Get('types/revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate revenue report for a hotel' })
  @ApiQuery({ name: 'hotelId', description: 'Hotel ID', required: true })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', required: true })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns revenue report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async generateRevenueReport(
    @Query('hotelId') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const reportDto: GenerateReportDto = {
        type: ReportType.REVENUE,
        hotelId,
        startDate,
        endDate
      };
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'generateReport' }, 
          { reportDto, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error generating revenue report');
    }
  }

  @Get('types/activity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate reservation activity report for a hotel' })
  @ApiQuery({ name: 'hotelId', description: 'Hotel ID', required: true })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', required: true })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns reservation activity report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async generateActivityReport(
    @Query('hotelId') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const reportDto: GenerateReportDto = {
        type: ReportType.RESERVATION_ACTIVITY,
        hotelId,
        startDate,
        endDate
      };
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'generateReport' }, 
          { reportDto, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error generating reservation activity report');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Report created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async create(@Body() generateReportDto: GenerateReportDto, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      return firstValueFrom(
        this.reportServiceClient.send(
          { cmd: 'generateReport' }, 
          { reportDto: generateReportDto, userId, userRole }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error creating report');
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort report service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortReportService() {
    try {
      return firstValueFrom(
        this.reportServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Report service execution aborted by admin');
    }
  }
}