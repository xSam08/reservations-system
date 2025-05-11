import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Report } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: any) {} // Replace 'any' with actual ReportService once created

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all reports' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return report by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Report not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Report created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  create(@Body() createReportDto: any) { // Replace 'any' with actual DTO
    return this.reportService.create(createReportDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Report not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateReportDto: any) { // Replace 'any' with actual DTO
    return this.reportService.update(id, updateReportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Report not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort report service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Report service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_report_by_id' })
  getReportById(id: string) {
    return this.reportService.findOne(id);
  }

  @MessagePattern({ cmd: 'generate_hotel_report' })
  generateHotelReport(hotelId: string) {
    return this.reportService.generateHotelReport(hotelId);
  }

  @MessagePattern({ cmd: 'generate_system_report' })
  generateSystemReport() {
    return this.reportService.generateSystemReport();
  }
}