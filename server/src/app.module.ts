import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ArtistModule } from 'src/artist/artist.module';
import { SongModule } from "src/song/song.module";
import { ListenModule } from "src/listen/listen.module";
import { CommonModule } from 'src/common/common.module';
import { HealthCheckModule } from 'src/health-check/health-check.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    // TODO move validationSchema out of app.module
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
    ListenModule,
    UserModule,
    ArtistModule,
    CommonModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
