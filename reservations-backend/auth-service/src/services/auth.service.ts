import { Injectable, UnauthorizedException, ConflictException, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserResponseDto, UpdateUserDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from '../dto';
import { JwtPayload } from '../common/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: UserResponseDto; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const user = this.userRepository.create({
      user_id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
      email_verification_token: emailVerificationToken,
      email_verification_expires: emailVerificationExpires,
      email_verified: false,
    });

    const savedUser = await this.userRepository.save(user);
    const token = await this.generateToken(savedUser);

    // Send verification email
    await this.sendVerificationEmail(savedUser.email, emailVerificationToken);

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

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { 
        email_verification_token: verifyEmailDto.token,
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (!user.email_verification_expires || user.email_verification_expires < new Date()) {
      throw new UnauthorizedException('Verification token has expired');
    }

    await this.userRepository.update(
      { user_id: user.user_id },
      { 
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
        updated_at: new Date()
      }
    );

    return { message: 'Email verified successfully' };
  }

  async resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: resendVerificationDto.email }
    });

    if (!user) {
      return { message: 'If the email exists, a verification link has been sent' };
    }

    if (user.email_verified) {
      return { message: 'Email is already verified' };
    }

    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.userRepository.update(
      { user_id: user.user_id },
      {
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires,
        updated_at: new Date()
      }
    );

    await this.sendVerificationEmail(user.email, emailVerificationToken);

    return { message: 'Verification email sent successfully' };
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const notificationServiceUrl = this.configService.get('NOTIFICATION_SERVICE_URL') || 'http://localhost:3006';
      const authServiceUrl = this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3001';
      const verificationUrl = `${authServiceUrl}/auth/verify-email?token=${token}`;

      const emailData = {
        to: email,
        verificationUrl: verificationUrl,
        token: token
      };

      // Call notification service to send email
      const response = await fetch(`${notificationServiceUrl}/email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.error('Failed to send verification email:', await response.text());
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phone_number,
      role: user.role,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}