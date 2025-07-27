import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformDataInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        statusCode: context.switchToHttp().getResponse<Response<T>>()
          .statusCode,
        data,
      })),
    );
  }
}
