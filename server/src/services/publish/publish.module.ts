import {
  Module,
  DynamicModule,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { SnsFactoryProvider } from 'src/services/publish/sns.factory';
import { TOPIC_ARN } from 'src/common/symbols';
import { PublishService } from 'src/services/publish/publish.service';

export interface PublishModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<any> | any;
  inject?: any[];
  extraProviders?: Provider[];
}

@Module({})
export class PublishModule {
  static registerAsync(options: PublishModuleAsyncOptions): DynamicModule {
    return {
      module: PublishModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        SnsFactoryProvider,
        PublishService,
        ...(options.extraProviders || []),
      ],
      exports: [PublishService],
    };
  }

  private static createAsyncProviders(
    options: PublishModuleAsyncOptions
  ): Provider[] {
    return [this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(
    options: PublishModuleAsyncOptions
  ): Provider {
    return {
      provide: TOPIC_ARN,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
