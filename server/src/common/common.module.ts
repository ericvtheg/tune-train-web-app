import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { AuthModule } from 'src/common/auth/auth.module';
import { GlobalGuard } from 'src/common/guards/global.guard';
import { LoggingMiddleware } from 'src/common/middleware/logging.middleware';
// import { HashPipe } from 'src/common/pipes/hash.pipe';
import { ConfigModule } from '@nestjs/config';
import { config } from 'src/common/config/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    // AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        APP_PORT: Joi.required().default(3000),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_URL: Joi.required(),
        STAGE: Joi.required(),
        SONGS_BUCKET: Joi.required(),
        AWS_REGION: Joi.required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
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
