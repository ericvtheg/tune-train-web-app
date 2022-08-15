import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { GlobalGuard } from './guards/global.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { HashPipe } from './pipes/hash.pipe';

@Module({
  imports: [AuthModule],
  providers: [{ provide: APP_GUARD, useClass: GlobalGuard }, HashPipe],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
