import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ListenConsumer } from 'src/domain-objects/listen/listen.consumer';
import { ListenResolver } from 'src/domain-objects/listen/listen.resolver';
import { ListenService } from 'src/domain-objects/listen/listen.service';
import { QueueModule } from 'src/services/queue/queue.module';
import { TransformedConfig } from 'src/common/config/config';


@Module({
  imports: [
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
    ListenConsumer,
  ],
  exports: [ListenService],
})
export class ListenModule {}