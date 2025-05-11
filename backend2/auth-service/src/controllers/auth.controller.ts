import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    return { 
      message: 'Login endpoint works', 
      data: loginDto 
    };
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return { 
      message: 'Register endpoint works', 
      data: registerDto 
    };
  }
}
EOF < /dev/null
