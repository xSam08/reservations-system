import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Query, Param, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '@app/shared';
import { SearchHotelDto } from '@app/shared/dto/hotel/search-hotel.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('hotels')
@Controller('hotels')
export class HotelController {
  constructor(
    @Inject('HOTEL_SERVICE') private readonly hotelServiceClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all hotels' })
  async findAll() {
    try {
      return firstValueFrom(
        this.hotelServiceClient.send({ cmd: 'findAll' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching hotels');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search hotels with advanced filtering' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns filtered hotels with available rooms' })
  async searchHotels(@Query() searchHotelDto: SearchHotelDto) {
    try {
      return firstValueFrom(
        this.hotelServiceClient.send({ cmd: 'searchHotels' }, searchHotelDto)
      );
    } catch (error) {
      throw new InternalServerErrorException('Error searching hotels');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiParam({ name: 'id', description: 'Hotel ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the hotel' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hotel not found' })
  async findOne(@Param('id') id: string) {
    try {
      const hotel = await firstValueFrom(
        this.hotelServiceClient.send({ cmd: 'findOne' }, { id })
      );
      
      if (!hotel) {
        throw new NotFoundException(`Hotel with ID ${id} not found`);
      }
      
      return hotel;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching hotel');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Hotel created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async create(@Body() createHotelDto: any, @Req() req: any) {
    try {
      const userId = req.user.sub;
      return firstValueFrom(
        this.hotelServiceClient.send(
          { cmd: 'create' }, 
          { ...createHotelDto, ownerId: userId }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error creating hotel');
    }
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get reviews for a hotel' })
  @ApiParam({ name: 'id', description: 'Hotel ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the hotel reviews' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Hotel not found' })
  async getHotelReviews(@Param('id') id: string) {
    try {
      const reviews = await firstValueFrom(
        this.hotelServiceClient.send({ cmd: 'getHotelReviews' }, { hotelId: id })
      );
      
      return reviews;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching hotel reviews');
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort hotel service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortHotelService() {
    try {
      return firstValueFrom(
        this.hotelServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Hotel service execution aborted by admin');
    }
  }
}