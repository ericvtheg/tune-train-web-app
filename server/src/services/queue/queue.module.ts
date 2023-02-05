import { Module, DynamicModule, ModuleMetadata, Provider } from '@nestjs/common';
import { QueueService } from 'src/services/queue/queue.service';
import { SqsFactoryProvider } from 'src/services/queue/sqs.factory';
import { SqsRepository } from 'src/services/queue/sqs.repository';
import { QUEUE_URL } from 'src/common/symbols';

export interface QueueModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<any> | any;
  inject?: any[];
  extraProviders?: Provider[];
}

@Module({})
export class QueueModule {
  static registerAsync(options: QueueModuleAsyncOptions): DynamicModule {
    return {
      module: QueueModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        QueueService,
        SqsFactoryProvider,
        SqsRepository,
        ...(options.extraProviders || []),
      ],
      exports: [QueueService],
    };
  }

  private static createAsyncProviders(
    options: QueueModuleAsyncOptions,
  ): Provider[] {
    return [this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(
    options: QueueModuleAsyncOptions,
  ): Provider {
    return {
      provide: QUEUE_URL,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}