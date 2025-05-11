import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, JwtPayload } from '@app/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'supersecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from returned user object
    const { password, ...result } = user;
    return result;
  }
}