import { Module } from "@nestjs/common";
import { FileStorageService } from 'src/common/services/file-storage/file-storage.service';
import { S3FactoryProvider } from "src/common/services/file-storage/s3.factory";
import { S3Repository } from "src/common/services/file-storage/s3.repository";

@Module({
  providers: [FileStorageService, S3FactoryProvider, S3Repository],
  exports: [FileStorageService],
})
export class FileStorageModule {}