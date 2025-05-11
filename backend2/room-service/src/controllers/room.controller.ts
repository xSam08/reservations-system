import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Room, RoomType } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: any) {} // Replace 'any' with actual RoomService once created

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all rooms' })
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return room by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  create(@Body() createRoomDto: any) { // Replace 'any' with actual DTO
    return this.roomService.create(createRoomDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateRoomDto: any) { // Replace 'any' with actual DTO
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort room service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Room service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_room_by_id' })
  getRoomById(id: string) {
    return this.roomService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_rooms_by_hotel' })
  getRoomsByHotel(hotelId: string) {
    return this.roomService.findByHotel(hotelId);
  }

  @MessagePattern({ cmd: 'get_available_rooms' })
  getAvailableRooms(filters: { hotelId?: string, roomType?: RoomType }) {
    return this.roomService.findAvailable(filters);
  }
}