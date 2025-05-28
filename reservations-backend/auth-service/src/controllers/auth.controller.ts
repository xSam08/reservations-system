import { Controller, Post, Body, UseGuards, Request, Get, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto, CreateUserDto, UpdateUserDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from '../dto';
import { ApiResponse } from '../common/types';
import { ResponseUtil } from '../common/response.util';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerApiResponse({ status: 201, description: 'User registered successfully' })
  @SwaggerApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.register(createUserDto);
      return ResponseUtil.success(result, 'User registered successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @SwaggerApiResponse({ status: 200, description: 'Login successful' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    try {
      const result = await this.authService.login(req.user);
      return ResponseUtil.success(result, 'Login successful');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @SwaggerApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    try {
      const result = await this.authService.getProfile(req.user.userId);
      return ResponseUtil.success(result, 'Profile retrieved successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @SwaggerApiResponse({ status: 200, description: 'Profile updated successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.authService.updateProfile(req.user.userId, updateUserDto);
      return ResponseUtil.success(result, 'Profile updated successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @SwaggerApiResponse({ status: 200, description: 'Logout successful' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req: any) {
    try {
      const result = await this.authService.logout(req.user.userId);
      return ResponseUtil.success(result, 'Logout successful');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @SwaggerApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.authService.refreshToken(refreshTokenDto);
      return ResponseUtil.success(result, 'Token refreshed successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @SwaggerApiResponse({ status: 200, description: 'Password reset email sent' })
  @SwaggerApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const result = await this.authService.forgotPassword(forgotPasswordDto);
      return ResponseUtil.success(result, 'Password reset email sent');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @SwaggerApiResponse({ status: 200, description: 'Password reset successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto);
      return ResponseUtil.success(result, 'Password reset successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT token' })
  @SwaggerApiResponse({ status: 200, description: 'Token is valid' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Request() req: any) {
    return ResponseUtil.success(req.user, 'Token is valid');
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address via GET link' })
  @SwaggerApiResponse({ status: 200, description: 'Email verified successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid or expired verification token' })
  async verifyEmailGet(@Query('token') token: string) {
    try {
      if (!token) {
        return ResponseUtil.error('Verification token is required');
      }
      const result = await this.authService.verifyEmail({ token });
      return `
        <html>
          <head><title>Email Verified</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #28a745;">✅ Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now close this window and return to the application.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `;
    } catch (error: any) {
      return `
        <html>
          <head><title>Verification Failed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc3545;">❌ Verification Failed</h1>
            <p>The verification link is invalid or has expired.</p>
            <p>Please request a new verification email.</p>
          </body>
        </html>
      `;
    }
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address via POST' })
  @SwaggerApiResponse({ status: 200, description: 'Email verified successfully' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid or expired verification token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      const result = await this.authService.verifyEmail(verifyEmailDto);
      return ResponseUtil.success(result, 'Email verified successfully');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification' })
  @SwaggerApiResponse({ status: 200, description: 'Verification email sent' })
  @SwaggerApiResponse({ status: 400, description: 'Bad request' })
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    try {
      const result = await this.authService.resendVerification(resendVerificationDto);
      return ResponseUtil.success(result, 'Verification email sent');
    } catch (error: any) {
      return ResponseUtil.error(error.message);
    }
  }
}