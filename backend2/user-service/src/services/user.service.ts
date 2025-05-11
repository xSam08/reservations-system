import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@app/shared';

@Injectable()
export class UserService {
  private users = []; // This would typically be a database connection

  async findAll() {
    return this.users;
  }

  async findOne(id: string) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date()
    };
    
    return this.users[userIndex];
  }

  async remove(id: string) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    
    return deletedUser;
  }

  async findByRole(role: UserRole) {
    return this.users.filter(user => user.role === role);
  }
}