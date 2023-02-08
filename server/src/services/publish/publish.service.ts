import { Injectable, Scope, Inject } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { TOPIC_ARN } from 'src/common/symbols';

@Injectable({ scope: Scope.TRANSIENT })
export class PublishService {
  constructor(
    @Inject(SNS) private readonly sns: SNS,
    @Inject(TOPIC_ARN) private readonly topicArn: string,
  ) {}

  async publishMessage(message: string): Promise<void> {
    await this.sns.publish({ TopicArn: this.topicArn, Message: message }).promise();
  }
}
