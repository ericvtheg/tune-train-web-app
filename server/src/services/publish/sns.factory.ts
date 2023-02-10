import { SNS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const SnsFactoryProvider: FactoryProvider<SNS> = {
  provide: SNS,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new SNS({
      region: configService.get<string>('region'),
      endpoint: stage === 'local' ? 'http://localhost:4566' : undefined,
    });
  },
};
