import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageService } from './file-storage.service';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME } from '../../symbols';

const mockS3Service = {};

describe('FileStorageService', () => {
  let service: FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileStorageService,
        {
          provide: S3,
          useValue: mockS3Service
        },
        {
          provide: BUCKET_NAME,
          useValue: "someBucketName"
        },
      ],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
