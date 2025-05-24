import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UserResponseDto } from '../dto';
import { UserRole } from '../common/enums';
import { PaginationParams, PaginatedResponse } from '../common/types';
import { PaginationUtil } from '../common/pagination.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(params: PaginationParams & { role?: UserRole }): Promise<PaginatedResponse<UserResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', role } = params;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    const userResponses = users.map(user => this.mapToUserResponse(user));

    return PaginationUtil.createPaginatedResponse(userResponses, total, params);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return this.mapToUserResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { user_id: id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email }
    });
  }

  async getUserReservations(userId: string, params: PaginationParams): Promise<PaginatedResponse<any>> {
    // In a real implementation, this would query the reservation service
    // For now, return mock data or implement cross-service communication
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: 0
    };
  }

  async getHotelOwners(params: PaginationParams): Promise<PaginatedResponse<UserResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.HOTEL_ADMIN })
      .orderBy(`user.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();
    const userResponses = users.map(user => this.mapToUserResponse(user));

    return PaginationUtil.createPaginatedResponse(userResponses, total, params);
  }

  async getCustomers(params: PaginationParams): Promise<PaginatedResponse<UserResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .orderBy(`user.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(PaginationUtil.calculateOffset(page, limit))
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();
    const userResponses = users.map(user => this.mapToUserResponse(user));

    return PaginationUtil.createPaginatedResponse(userResponses, total, params);
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Add status field to user entity if it doesn't exist
    const updatedUser = await this.userRepository.save({
      ...user,
      status,
      updated_at: new Date()
    });

    return this.mapToUserResponse(updatedUser);
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phone_number,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}