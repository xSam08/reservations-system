import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number', required: false })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ 
    enum: UserRole, 
    default: UserRole.CUSTOMER, 
    description: 'User role', 
    required: false 
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;
}