import { Injectable, Scope } from '@nestjs/common';
import { S3Repository } from 'src/common/services/file-storage/s3.repository';
import type { Opaque } from 'type-fest';

export type DownloadLink = Opaque<string, 'DownloadLink'>;
export type UploadLink = Opaque<string, 'UploadLink'>;

@Injectable({ scope: Scope.TRANSIENT })
export class FileStorageService {
  constructor(private s3Repository: S3Repository) {}

  async generateDownloadLink(key: string): Promise<DownloadLink> {
    // TODO figure out why opaque types are compatible with string here
    return await this.s3Repository.generateDownloadLink(key);
  }

  async generateUploadLink(key: string): Promise<UploadLink> {
    // TODO figure out why opaque types are compatible with string here
    return await this.s3Repository.generateUploadLink(key);
  }
}
