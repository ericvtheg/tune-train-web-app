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
import { ConfigService } from '@nestjs/config';
import { HealthCheckModule } from './health-check/health-check.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    // TODO move validationSchema out of app.module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        APP_PORT: Joi.required().default(3000),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        STAGE: Joi.required(),
        SONGS_BUCKET: Joi.required(),
        AWS_REGION: Joi.required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: `${process.cwd()}/src/schema.gql`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.name"),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: (configService.get<string>("stage")) ? true : false,
        migrations: ['dist/db/migrations/*.js'],
        cli: {
          migrationsDir: 'src/db/migrations',
        },
      }),
      inject: [ConfigService],
    }),
    // SongsModule,
    UsersModule,
    // ArtistsModule,
    CommonModule,
    AuthModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
