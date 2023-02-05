import { Module, Logger } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SongModule } from 'src/song/song.module';
import { ListenModule } from 'src/listen/listen.module';
import { CommonModule } from 'src/common/common.module';
import { HealthCheckModule } from 'src/health-check/health-check.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule, loggingMiddleware, QueryInfo } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware({
          logger: new Logger('PrismaMiddleware'),
          logLevel: 'debug', // default is `debug`
          logMessage: (query: QueryInfo) =>
            `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
        })],
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
    CommonModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
