import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    try {
      // Validate token with auth service
      const user = await firstValueFrom(
        this.authServiceClient.send({ cmd: 'validate_token' }, authHeader.substring(7))
      );
      
      // If valid, attach user to request
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}