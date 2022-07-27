import { S3 } from 'aws-sdk';
import { Injectable, Inject } from '@nestjs/common';
import { BUCKET_NAME } from '../../symbols';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject(S3) private readonly s3: S3,
    @Inject(BUCKET_NAME) private readonly bucketName: string,
  ) {}

  async upload(key: string, file: Buffer): Promise<any> {
    return this.s3
      .upload({ Bucket: this.bucketName, Key: key, Body: file })
      .promise();
  }

  async generateDownloadLink(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 300,
    });
  }
}
