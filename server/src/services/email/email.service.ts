import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { STAGE } from 'src/common/config/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly ses: SES,
    private readonly configService: ConfigService
  ) {}

  async sendForgotPasswordEmail({
    email,
    resetToken,
  }: {
    email: string;
    resetToken: string;
  }): Promise<void> {
    const args = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `some test body ${resetToken}`, // TODO use some url with resetToken as param
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Your Password Reset',
        },
      },
      Source: 'some@email.com',
    };
    if (this.configService.get('stage') === STAGE.prod) {
      await this.ses.sendEmail().promise();
    } else {
      Logger.log('To be sent email args', args);
    }
  }
}
