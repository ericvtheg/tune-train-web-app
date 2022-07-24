import { Module, DynamicModule, FactoryProvider } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileStorageService } from './fileStorage/fileStorage.service';
import { BUCKET_NAME } from '../symbols';
import { ConfigService } from '@nestjs/config';

const s3Provider: FactoryProvider = {
  provide: 's3',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new S3({
      accessKeyId: configService.get<string>('aws.accessKey'),
      secretAccessKey: configService.get<string>('aws.secretAccessKey'),
      region: 'us-east-1',
      s3ForcePathStyle: true,
      endpoint: stage === 'local' ? 'http://localhost:4566' : undefined,
    });
  },
};

@Module({})
export class ServiceModule {
  static register(options: Record<string, any>): DynamicModule {
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
