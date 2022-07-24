import { S3 } from 'aws-sdk';
import { Injectable, Inject } from '@nestjs/common';
import { BUCKET_NAME } from '../../symbols';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject('s3') private s3: S3,
    @Inject(BUCKET_NAME) private bucketName: string,
  ) {}

  async upload(key: string, file: Buffer): Promise<any> {
    return this.s3
      .upload({ Bucket: this.bucketName, Key: key, Body: file })
      .promise();
  }
}
