import { Module, DynamicModule, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { FileStorageService } from 'src/common/services/file-storage/file-storage.service';
import { S3FactoryProvider } from "src/common/services/file-storage/s3.factory";
import { S3Repository } from "src/common/services/file-storage/s3.repository";
import { BUCKET_NAME } from 'src/common/symbols';
import { ConfigService } from '@nestjs/config';

export interface FileStorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<any> | any;
  inject?: any[];
  extraProviders?: Provider[];
}

@Module({})
export class FileStorageModule {
  static registerAsync(options: FileStorageModuleAsyncOptions): DynamicModule {
    return {
      module: FileStorageModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        FileStorageService, 
        S3FactoryProvider, 
        S3Repository,
        ...(options.extraProviders || []),
      ],
      exports: [FileStorageService],
    }
  }

  private static createAsyncProviders(
    options: FileStorageModuleAsyncOptions,
  ): Provider[] {
    return [this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(
    options: FileStorageModuleAsyncOptions,
  ): Provider {
      return {
        provide: BUCKET_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
  }
}