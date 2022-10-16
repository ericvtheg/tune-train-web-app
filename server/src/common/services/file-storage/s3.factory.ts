import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const S3FactoryProvider: FactoryProvider = {
  provide: S3,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new S3({
      region: configService.get<string>('region'),
      s3ForcePathStyle: stage === 'local',
      endpoint: stage === 'local' ? 'http://localhost:4566' : null,
    });
  },
};