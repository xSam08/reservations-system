import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto';
import { UserRole } from '../common/enums';
import { PaginationParams } from '../common/types';
import { ResponseUtil } from '../common/response.util';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams & { role?: UserRole }
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.findAll(params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Headers('x-user-id') userId: string) {
    try {
      const result = await this.usersService.findOne(userId);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  async findOne(
    @Param('id') id: string,
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      if (id !== currentUserId && userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.findOne(id);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Headers('x-user-id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      const result = await this.usersService.update(userId, updateUserDto);
      return ResponseUtil.success(result, 'Profile updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(
    @Param('id') id: string,
    @Headers('x-user-role') userRole: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.update(id, updateUserDto);
      return ResponseUtil.success(result, 'User updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(
    @Param('id') id: string,
    @Headers('x-user-role') userRole: string
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      await this.usersService.remove(id);
      return ResponseUtil.success(null, 'User deleted successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get(':id/reservations')
  @ApiOperation({ summary: 'Get user reservations' })
  @ApiResponse({ status: 200, description: 'User reservations retrieved successfully' })
  async getUserReservations(
    @Param('id') id: string,
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams
  ) {
    try {
      if (id !== currentUserId && userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.getUserReservations(id, params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('hotel-owners')
  @ApiOperation({ summary: 'Get all hotel owners (admin only)' })
  @ApiResponse({ status: 200, description: 'Hotel owners retrieved successfully' })
  async getHotelOwners(
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.getHotelOwners(params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers (admin only)' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  async getCustomers(
    @Headers('x-user-role') userRole: string,
    @Query() params: PaginationParams
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.getCustomers(params);
      return ResponseUtil.success(result);
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(
    @Param('id') id: string,
    @Headers('x-user-role') userRole: string,
    @Body() statusDto: { status: 'active' | 'inactive' | 'suspended' }
  ) {
    try {
      if (userRole !== UserRole.SYSTEM_ADMIN) {
        return ResponseUtil.error('Insufficient permissions');
      }

      const result = await this.usersService.updateUserStatus(id, statusDto.status);
      return ResponseUtil.success(result, 'User status updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}