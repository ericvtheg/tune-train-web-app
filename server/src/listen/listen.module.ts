import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ListenConsumer } from 'src/listen/listen.consumer';
import { ListenResolver } from 'src/listen/listen.resolver';
import { ListenService } from 'src/listen/listen.service';
import { ListenRepository } from 'src/listen/listen.repository';
import { SongModule } from 'src/song/song.module';
import { UserModule } from 'src/user/user.module';
import { QueueModule } from 'src/common/services/queue/queue.module';
import { TransformedConfig } from 'src/common/config/config';


@Module({
  imports: [
    forwardRef(() => SongModule),
    forwardRef(() => UserModule),
    QueueModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TransformedConfig, true>) =>
        configService.get<string>('queue.listenQueue.url', { infer: true }),
    }),
    SqsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TransformedConfig, true>) => ({
        consumers: [{
          name: configService.get<string>('queue.listenQueue.name', { infer: true }),
          queueUrl: configService.get<string>('queue.listenQueue.url', { infer: true }),
        }],
      }),
    }),
  ],
  providers: [
    ListenResolver,
    ListenService,
    ListenRepository,
    ListenConsumer,
  ],
  exports: [ListenService],
})
export class ListenModule {}