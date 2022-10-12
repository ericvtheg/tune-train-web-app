import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ArtistModule } from 'src/artist/artist.module';
import { SongModule } from "src/song/song.module";
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import * as Joi from '@hapi/joi';
import { configuration } from 'src/config/configuration';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { HealthCheckModule } from 'src/health-check/health-check.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from 'nestjs-prisma';


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
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        // middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: `${process.cwd()}/src/schema.gql`,
    }),
    PrismaModule,
    SongModule,
    UserModule,
    ArtistModule,
    // CommonModule,
    // AuthModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
