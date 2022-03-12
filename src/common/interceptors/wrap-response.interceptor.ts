import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// can use an interceptor for analytics tracking

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const name = context.getHandler().name;
    const now = Date.now();
    return next.handle().pipe(
      tap((value) =>
        console.log({
          duration: `${name}: ${Date.now() - now}ms`,
          data: value,
        }),
      ),
    );
  }
}
