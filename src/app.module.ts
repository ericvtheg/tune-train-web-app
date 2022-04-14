import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from './artists/artists.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    SongsModule,
    UsersModule,
    ArtistsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
      }),
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
