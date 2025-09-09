import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthUser } from '../auth.type';
import { IS_PUBLIC_KEY } from '../decoratots/auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is public, if so, allow access
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // Hacking
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }

    const request: Request = context.switchToHttp().getRequest();
    const apiPath = (request.route as { path: string })?.path;
    const method = request.method;

    const permissions = (user as unknown as AuthUser).permissions ?? [];
    const userHasPermission = permissions.some(
      (permission) =>
        permission.apiPath === apiPath && permission.method === method,
    );

    if (!userHasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
