import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { RequestWithUser } from '../auth.type';

export const IS_PUBLIC_KEY = 'isPublic';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
