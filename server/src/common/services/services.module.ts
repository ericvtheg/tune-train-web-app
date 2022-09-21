import { Module, DynamicModule, FactoryProvider } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileStorageService } from './file-storage/file-storage.service';
import { BUCKET_NAME } from '../symbols';
import { ConfigService } from '@nestjs/config';

const s3Provider: FactoryProvider = {
  provide: S3,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new S3({
      region: configService.get<string>('region'), //TODO put in config
      s3ForcePathStyle: stage === 'local',
      endpoint: stage === 'local' ? 'http://localhost:4566' : null, // TODO: put in config
    });
  },
};

@Module({})
export class ServiceModule {
  static register(options: Record<string, string>): DynamicModule {
    const bucketNameProvider: FactoryProvider = {
      provide: BUCKET_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get<string>(options.bucketNameEnvVar);
      },
    };

    return {
      module: ServiceModule,
      providers: [bucketNameProvider, s3Provider, FileStorageService],
      exports: [FileStorageService, bucketNameProvider],
    };
  }
}
