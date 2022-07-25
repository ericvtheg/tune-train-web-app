import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from './artists/artists.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from '@hapi/joi';
import { configuration } from './config/configuration';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    SongsModule,
    UsersModule,
    ArtistsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        STAGE: Joi.required(),
        SONGS_BUCKET: Joi.required(),
        AWS_REGION: Joi.required(),
        AWS_ACCESS_KEY_ID: Joi.required(),
        AWS_SECRET_ACCESS_KEY: Joi.required(),
      }),
    }),
    CommonModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
