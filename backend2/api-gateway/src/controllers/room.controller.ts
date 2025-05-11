import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Query, Param, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '@app/shared';
import { SearchRoomDto, GetRoomAvailabilityDto } from '@app/shared/dto/room';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(
    @Inject('ROOM_SERVICE') private readonly roomServiceClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all rooms' })
  async findAll() {
    try {
      return firstValueFrom(
        this.roomServiceClient.send({ cmd: 'findAll' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching rooms');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search rooms with advanced filtering' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns filtered rooms' })
  async searchRooms(@Query() searchRoomDto: SearchRoomDto) {
    try {
      return firstValueFrom(
        this.roomServiceClient.send({ cmd: 'searchRooms' }, searchRoomDto)
      );
    } catch (error) {
      throw new InternalServerErrorException('Error searching rooms');
    }
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for a specific date range' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns available rooms' })
  async getAvailableRooms(@Query() searchRoomDto: SearchRoomDto) {
    try {
      // Ensure onlyAvailable is true
      const searchParams = { ...searchRoomDto, onlyAvailable: true };
      
      return firstValueFrom(
        this.roomServiceClient.send({ cmd: 'searchRooms' }, searchParams)
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching available rooms');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the room' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async findOne(@Param('id') id: string) {
    try {
      const room = await firstValueFrom(
        this.roomServiceClient.send({ cmd: 'findOne' }, { id })
      );
      
      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      
      return room;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching room');
    }
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get room availability calendar' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the room availability calendar' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async getRoomAvailability(
    @Param('id') id: string,
    @Query() dateRangeDto: GetRoomAvailabilityDto
  ) {
    try {
      const availability = await firstValueFrom(
        this.roomServiceClient.send(
          { cmd: 'getRoomAvailability' }, 
          { roomId: id, ...dateRangeDto }
        )
      );
      
      return availability;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching room availability');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async create(@Body() createRoomDto: any) {
    try {
      return firstValueFrom(
        this.roomServiceClient.send({ cmd: 'create' }, createRoomDto)
      );
    } catch (error) {
      throw new InternalServerErrorException('Error creating room');
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort room service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortRoomService() {
    try {
      return firstValueFrom(
        this.roomServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Room service execution aborted by admin');
    }
  }
}