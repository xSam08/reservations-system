import { ResponseUtil } from "../common/response.util";
import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RoomsService } from '../services/rooms.service';
import { CreateRoomDto, UpdateRoomDto } from '../dto';
import { RoomType } from '../common/enums';
import { PaginationParams } from '../common/types';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Rooms')
@Controller('hotels/:hotelId/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room in a hotel' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  async create(
    @Param('hotelId') hotelId: string,
    @Body() createRoomDto: CreateRoomDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      const result = await this.roomsService.create(hotelId, createRoomDto, userId, userRole);
      return ResponseUtil.success(result, 'Room created successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms in a hotel with filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: RoomType })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async findByHotel(
    @Param('hotelId') hotelId: string,
    @Query() params: PaginationParams & { 
      type?: RoomType; 
      minPrice?: number; 
      maxPrice?: number; 
      available?: boolean; 
    }
  ) {
    try {
      const result = await this.roomsService.findByHotel(hotelId, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for specific dates' })
  @ApiQuery({ name: 'checkIn', required: true, type: String })
  @ApiQuery({ name: 'checkOut', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  async getAvailable(
    @Param('hotelId') hotelId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string
  ) {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (checkInDate >= checkOutDate) {
        return ResponseUtil.error('Check-in date must be before check-out date');
      }

      const result = await this.roomsService.getAvailableRooms(hotelId, checkInDate, checkOutDate);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsGlobalController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('types')
  @ApiOperation({ summary: 'Get available room types' })
  @ApiResponse({ status: 200, description: 'Room types retrieved successfully' })
  async getRoomTypes() {
    try {
      const roomTypes = Object.values(RoomType);
      return ResponseUtil.success(roomTypes, 'Room types retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'hotelId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: RoomType })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async findAll(
    @Query() params: PaginationParams & { 
      hotelId?: string;
      type?: RoomType; 
      minPrice?: number; 
      maxPrice?: number; 
      available?: boolean; 
    }
  ) {
    try {
      const result = await this.roomsService.findAll(params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  async create(
    @Body() createRoomDto: CreateRoomDto & { hotelId: string },
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      const { hotelId, ...roomData } = createRoomDto;
      const result = await this.roomsService.create(hotelId, roomData, userId, userRole);
      return ResponseUtil.success(result, 'Room created successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search available rooms across all hotels' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'checkIn', required: false, type: String })
  @ApiQuery({ name: 'checkOut', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: RoomType })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'guests', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async searchAvailable(
    @Query() params: {
      city?: string;
      country?: string;
      checkIn?: string;
      checkOut?: string;
      type?: RoomType;
      minPrice?: number;
      maxPrice?: number;
      guests?: number;
    } & PaginationParams
  ) {
    try {
      const searchParams = {
        ...params,
        checkInDate: params.checkIn ? new Date(params.checkIn) : undefined,
        checkOutDate: params.checkOut ? new Date(params.checkOut) : undefined,
        roomType: params.type,
      };

      if (searchParams.checkInDate && searchParams.checkOutDate) {
        if (searchParams.checkInDate >= searchParams.checkOutDate) {
          return ResponseUtil.error('Check-in date must be before check-out date');
        }
      }

      const result = await this.roomsService.searchAvailableRooms(searchParams);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get room availability for specific dates' })
  @ApiQuery({ name: 'checkIn', required: false, type: String })
  @ApiQuery({ name: 'checkOut', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Room availability retrieved successfully' })
  async getRoomAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string
  ) {
    try {
      if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate >= checkOutDate) {
          return ResponseUtil.error('Check-in date must be before check-out date');
        }

        const result = await this.roomsService.getRoomAvailability(id, checkInDate, checkOutDate);
        return ResponseUtil.success(result);
      } else {
        // Return basic availability status
        const room = await this.roomsService.findOne(id);
        return ResponseUtil.success({ 
          roomId: id, 
          isAvailable: room.isAvailable,
          status: room.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'
        });
      }
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.roomsService.findOne(id);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update room by ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      const result = await this.roomsService.update(id, updateRoomDto, userId, userRole);
      return ResponseUtil.success(result, 'Room updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete room by ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  async remove(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      await this.roomsService.remove(id, userId, userRole);
      return ResponseUtil.success(null, 'Room deleted successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id/availability')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update room availability' })
  @ApiResponse({ status: 200, description: 'Room availability updated successfully' })
  async updateAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      // First check if user owns this room's hotel
      const room = await this.roomsService.findOne(id);
      // You would need to add a method to check ownership or use the existing update method
      
      await this.roomsService.updateAvailability(id, isAvailable);
      return ResponseUtil.success(null, 'Room availability updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}