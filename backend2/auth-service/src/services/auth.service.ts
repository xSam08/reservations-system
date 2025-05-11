import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginDto, RegisterDto, User, UserRole, JwtPayload } from '@app/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password, name, phoneNumber, role = UserRole.CUSTOMER } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create new user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        role,
      });

      // Save the user to the database
      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const token = this.generateToken(savedUser);

      // Return user (without password) and token
      const { password: _, ...userWithoutPassword } = savedUser;
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<{ user: Partial<User>; token: string }> {
    const token = this.generateToken(user);
    
    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get('JWT_SECRET', 'supersecret'),
      });
      
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    
    return this.jwtService.sign(payload);
  }
}