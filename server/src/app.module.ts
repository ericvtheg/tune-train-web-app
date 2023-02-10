import { Module, Logger } from '@nestjs/common';
import { UserModule } from 'src/domain-objects/user/user.module';
import { SongModule } from 'src/domain-objects/song/song.module';
import { ListenModule } from 'src/domain-objects/listen/listen.module';
import { CommonModule } from 'src/common/common.module';
import { HealthCheckController } from 'src/health-check.controller';
import { PrismaModule, loggingMiddleware, QueryInfo } from 'nestjs-prisma';
import { GraphQLModule } from 'src/graphql/graphql.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'debug', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    GraphQLModule,
    SongModule,
    ListenModule,
    UserModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
