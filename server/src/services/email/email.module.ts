import { Module } from '@nestjs/common';
import { SesFactoryProvider } from 'src/services/email/ses.factory';
import { EmailService } from 'src/services/email/email.service';

@Module({
  providers: [SesFactoryProvider, EmailService],
  exports: [EmailService],
})
export class EmailModule {}