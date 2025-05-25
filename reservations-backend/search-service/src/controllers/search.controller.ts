import { ResponseUtil } from "../common/response.util";
import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from '../services/search.service';
import { HotelSearchDto, RoomSearchDto, SearchSuggestionsDto } from '../dto/search.dto';

@ApiTags('Search')
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'search-service',
      version: '1.0.0'
    };
  }

  @Get('search/hotels')
  @ApiOperation({ summary: 'Search hotels with filters' })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async searchHotels(@Query() searchDto: HotelSearchDto) {
    try {
      const result = await this.searchService.searchHotels(searchDto);
      return ResponseUtil.success(result, 'Hotels retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('search/rooms')
  @ApiOperation({ summary: 'Search rooms within a hotel' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiQuery({ name: 'hotelId', required: true, description: 'Hotel ID' })
  async searchRooms(@Query() searchDto: RoomSearchDto) {
    try {
      const result = await this.searchService.searchRooms(searchDto);
      return ResponseUtil.success(result, 'Rooms retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('search/suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, enum: ['hotels', 'cities', 'locations'], description: 'Suggestion type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of suggestions' })
  async getSearchSuggestions(@Query() suggestionsDto: SearchSuggestionsDto) {
    try {
      const result = await this.searchService.getSearchSuggestions(suggestionsDto);
      return ResponseUtil.success(result, 'Suggestions retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('search/hotels')
  @ApiOperation({ summary: 'Advanced hotel search with complex filters' })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async advancedHotelSearch(@Body() searchDto: HotelSearchDto) {
    try {
      const result = await this.searchService.searchHotels(searchDto);
      return ResponseUtil.success(result, 'Hotels retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('search/rooms')
  @ApiOperation({ summary: 'Advanced room search with complex filters' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async advancedRoomSearch(@Body() searchDto: RoomSearchDto) {
    try {
      const result = await this.searchService.searchRooms(searchDto);
      return ResponseUtil.success(result, 'Rooms retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}