
import { Injectable, Scope } from '@nestjs/common';
import { S3Repository } from "src/common/services/file-storage/s3.repository";

@Injectable({scope: Scope.TRANSIENT})
export class FileStorageService {
  constructor(private s3Repository: S3Repository) {}

  async generateDownloadLink(key: string): Promise<string> {
    // TODO figure out why opaque types are compatible with string here
    return await this.s3Repository.generateDownloadLink(key);
  }

  async generateUploadLink(key: string): Promise<string> {
    // TODO figure out why opaque types are compatible with string here
    return await this.s3Repository.generateUploadLink(key);
  }
}
