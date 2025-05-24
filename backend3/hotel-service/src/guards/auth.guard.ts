import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    const userEmail = request.headers['x-user-email'];
    const userRole = request.headers['x-user-role'];

    if (!userId || !userEmail || !userRole) {
      throw new UnauthorizedException('User authentication headers missing');
    }

    request.user = {
      userId,
      email: userEmail,
      role: userRole
    };

    return true;
  }
}