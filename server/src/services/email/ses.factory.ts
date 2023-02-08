import { SES } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const SesFactoryProvider: FactoryProvider<SES> = {
  provide: SES,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const stage = configService.get<string>('stage');
    return new SES({
      region: configService.get<string>('region'),
      endpoint: stage === 'local' ? 'http://localhost:4566' : undefined,
    });
  },
};