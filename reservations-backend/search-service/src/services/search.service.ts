import { Injectable, BadRequestException } from '@nestjs/common';
import { HotelSearchDto, RoomSearchDto, SearchSuggestionsDto, SearchResponseDto } from '../dto/search.dto';

@Injectable()
export class SearchService {
  constructor() {}

  async searchHotels(searchDto: HotelSearchDto): Promise<SearchResponseDto> {
    try {
      // Mock implementation - replace with actual hotel service calls
      const mockHotels = [
        {
          hotelId: '1',
          name: 'Grand Hotel',
          city: searchDto.city || 'Demo City',
          rating: 4.5,
          basePrice: 150,
          category: 'LUXURY'
        },
        {
          hotelId: '2',
          name: 'Budget Inn',
          city: searchDto.city || 'Demo City',
          rating: 3.2,
          basePrice: 80,
          category: 'BUDGET'
        }
      ];

      // Apply basic filters
      let filteredHotels = mockHotels;
      
      if (searchDto.minPrice) {
        filteredHotels = filteredHotels.filter(h => h.basePrice >= searchDto.minPrice!);
      }
      
      if (searchDto.maxPrice) {
        filteredHotels = filteredHotels.filter(h => h.basePrice <= searchDto.maxPrice!);
      }
      
      if (searchDto.minRating) {
        filteredHotels = filteredHotels.filter(h => h.rating >= searchDto.minRating!);
      }
      
      if (searchDto.category) {
        filteredHotels = filteredHotels.filter(h => h.category === searchDto.category);
      }

      const page = searchDto.page || 1;
      const limit = searchDto.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: filteredHotels.slice(startIndex, endIndex),
        total: filteredHotels.length,
        page,
        limit,
        totalPages: Math.ceil(filteredHotels.length / limit),
        filters: {
          locations: ['Demo City', 'Another City'],
          priceRange: { min: 50, max: 500 },
          amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
          categories: ['BUDGET', 'ECONOMY', 'COMFORT', 'LUXURY', 'PREMIUM'],
          ratings: [5, 4, 3, 2, 1]
        }
      };

    } catch (error) {
      console.error('Hotel search error:', error);
      throw new BadRequestException('Failed to search hotels');
    }
  }

  async searchRooms(searchDto: RoomSearchDto): Promise<SearchResponseDto> {
    try {
      // Mock implementation - replace with actual room service calls
      const mockRooms = [
        {
          roomId: '1',
          hotelId: searchDto.hotelId,
          name: 'Standard Room',
          roomType: 'STANDARD',
          capacity: 2,
          basePrice: 120,
          amenities: ['WiFi', 'TV']
        },
        {
          roomId: '2',
          hotelId: searchDto.hotelId,
          name: 'Deluxe Suite',
          roomType: 'SUITE',
          capacity: 4,
          basePrice: 250,
          amenities: ['WiFi', 'TV', 'Balcony', 'Minibar']
        }
      ];

      // Apply basic filters
      let filteredRooms = mockRooms;
      
      if (searchDto.minPrice) {
        filteredRooms = filteredRooms.filter(r => r.basePrice >= searchDto.minPrice!);
      }
      
      if (searchDto.maxPrice) {
        filteredRooms = filteredRooms.filter(r => r.basePrice <= searchDto.maxPrice!);
      }
      
      if (searchDto.guests) {
        filteredRooms = filteredRooms.filter(r => r.capacity >= searchDto.guests!);
      }
      
      if (searchDto.roomType) {
        filteredRooms = filteredRooms.filter(r => r.roomType === searchDto.roomType);
      }

      const page = searchDto.page || 1;
      const limit = searchDto.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: filteredRooms.slice(startIndex, endIndex),
        total: filteredRooms.length,
        page,
        limit,
        totalPages: Math.ceil(filteredRooms.length / limit)
      };

    } catch (error) {
      console.error('Room search error:', error);
      throw new BadRequestException('Failed to search rooms');
    }
  }

  async getSearchSuggestions(suggestionsDto: SearchSuggestionsDto): Promise<{ suggestions: string[] }> {
    try {
      const { query, type = 'hotels', limit = 10 } = suggestionsDto;

      // Mock suggestions based on type
      let suggestions: string[] = [];
      
      if (type === 'hotels') {
        suggestions = [
          'Grand Hotel',
          'Budget Inn',
          'Luxury Resort',
          'City Center Hotel',
          'Beach Resort'
        ].filter(name => name.toLowerCase().includes(query.toLowerCase()));
      } else if (type === 'cities') {
        suggestions = [
          'New York',
          'Los Angeles',
          'Chicago',
          'Miami',
          'San Francisco'
        ].filter(city => city.toLowerCase().includes(query.toLowerCase()));
      } else if (type === 'locations') {
        suggestions = [
          'Downtown',
          'Airport',
          'Beach Area',
          'City Center',
          'Business District'
        ].filter(location => location.toLowerCase().includes(query.toLowerCase()));
      }

      return {
        suggestions: suggestions.slice(0, limit)
      };

    } catch (error) {
      console.error('Search suggestions error:', error);
      return { suggestions: [] };
    }
  }
}