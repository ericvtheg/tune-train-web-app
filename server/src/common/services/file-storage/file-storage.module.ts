import { Module, DynamicModule } from "@nestjs/common";
import { FileStorageService } from 'src/common/services/file-storage/file-storage.service';
import { S3FactoryProvider } from "src/common/services/file-storage/s3.factory";
import { S3Repository } from "src/common/services/file-storage/s3.repository";
import { BUCKET_NAME } from 'src/common/symbols';
import { ConfigService } from '@nestjs/config';

@Module({})
export class FileStorageModule {
  static register(bucketNameConfigPath: string): DynamicModule {
    return {
      module: FileStorageModule,
      providers: [
        FileStorageService, 
        S3FactoryProvider, 
        S3Repository,
        { 
          // TODO can there be multiple values for a bucket_name provider for transient scope?
          provide: BUCKET_NAME,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return configService.get<string>(bucketNameConfigPath);
          },
        },
      ],
      exports: [FileStorageService],
    };
  }
}