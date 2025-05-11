import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Hotel } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('hotels')
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: any) {} // Replace 'any' with actual HotelService once created

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all hotels' })
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return hotel by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hotel not found' })
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Hotel created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  create(@Body() createHotelDto: any) { // Replace 'any' with actual DTO
    return this.hotelService.create(createHotelDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update hotel' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Hotel updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hotel not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateHotelDto: any) { // Replace 'any' with actual DTO
    return this.hotelService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Delete hotel' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Hotel deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hotel not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.hotelService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort hotel service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Hotel service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_hotel_by_id' })
  getHotelById(id: string) {
    return this.hotelService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_hotels_by_owner' })
  getHotelsByOwner(ownerId: string) {
    return this.hotelService.findByOwner(ownerId);
  }
}