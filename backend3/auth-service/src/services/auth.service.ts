import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserResponseDto, UpdateUserDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from '../dto';
import { JwtPayload } from '../common/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: UserResponseDto; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const user = this.userRepository.create({
      user_id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const token = await this.generateToken(savedUser);

    return {
      user: this.mapToUserResponse(savedUser),
      token
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    return null;
  }

  async login(user: User): Promise<{ user: UserResponseDto; token: string }> {
    const token = await this.generateToken(user);
    
    return {
      user: this.mapToUserResponse(user),
      token
    };
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  private async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      userId: user.user_id,
      email: user.email,
      role: user.role
    };

    return this.jwtService.sign(payload);
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
      updated_at: new Date()
    });

    return this.mapToUserResponse(updatedUser);
  }

  async logout(userId: string): Promise<{ message: string }> {
    // In a real implementation, you would invalidate the token
    // by adding it to a blacklist or removing from a whitelist
    return { message: 'Logout successful' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshTokenDto.refreshToken);
      const user = await this.userRepository.findOne({
        where: { user_id: decoded.userId }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newToken = await this.generateToken(user);
      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email }
    });

    if (!user) {
      // For security, don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token (in real implementation, store this with expiration)
    const resetToken = this.jwtService.sign(
      { userId: user.user_id, type: 'password-reset' },
      { expiresIn: '1h' }
    );

    // In real implementation, send email with reset link
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const decoded = this.jwtService.verify(resetPasswordDto.token);
      
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const user = await this.userRepository.findOne({
        where: { user_id: decoded.userId }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);
      
      await this.userRepository.update(
        { user_id: user.user_id },
        { password: hashedPassword, updated_at: new Date() }
      );

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
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