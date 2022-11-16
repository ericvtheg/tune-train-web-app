import { Injectable, Inject } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME } from 'src/common/symbols';


@Injectable()
export class S3Repository {
  constructor(
    @Inject(S3) private readonly s3: S3,
    @Inject(BUCKET_NAME) private readonly bucketName: string,
  ) {}

  async generateDownloadLink(key: string): Promise<string> {
    return await this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 300,
    });
  }

  async generateUploadLink(key: string): Promise<string> {
    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: key,
      Expires: 300,
    });
  }
}