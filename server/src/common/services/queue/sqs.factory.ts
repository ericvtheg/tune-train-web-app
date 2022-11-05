import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const SqsFactoryProvider: FactoryProvider<SQS> = {
  provide: SQS,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new SQS({
      region: configService.get<string>('region'),
      endpoint: stage === 'local' ? 'http://localhost:4566' : null,
    });
  },
};