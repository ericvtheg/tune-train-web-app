import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const name = context.getHandler().name;
    const now = Date.now();
    return next.handle().pipe(
      tap((value) =>
        Logger.log({
          duration: `${name}: ${Date.now() - now}ms`,
          data: value,
        })
      )
    );
  }
}
