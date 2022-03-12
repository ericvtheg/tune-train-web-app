import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './guards/global.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  providers: [{ provide: APP_GUARD, useClass: GlobalGuard }],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
