import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { AuthModule } from 'src/common/auth/auth.module';
import { GlobalGuard } from 'src/common/guards/global.guard';
import { LoggingMiddleware } from 'src/common/middleware/logging.middleware';
// import { HashPipe } from 'src/common/pipes/hash.pipe';
import { ConfigModule } from '@nestjs/config';
import { validate, loader } from 'src/common/config/config';

@Module({
  imports: [
    // AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loader],
      validate,
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: GlobalGuard },
    // HashPipe,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
