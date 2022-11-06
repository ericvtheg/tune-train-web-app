import { Injectable, Inject } from "@nestjs/common";
import { SQS } from 'aws-sdk';
import { QUEUE_URL } from 'src/common/symbols';

@Injectable()
export class SqsRepository {
  constructor(
    @Inject(SQS) private readonly sqs: SQS,
    @Inject(QUEUE_URL) private readonly queueUrl: string,
  ) {}

  async sendMessage(body: string): Promise<void> {
    await this.sqs.sendMessage(
      {
        QueueUrl: this.queueUrl,
        MessageBody: body,
      }
    ).promise()
  }
}