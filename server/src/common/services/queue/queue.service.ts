import { Injectable, Scope } from '@nestjs/common';
import { SqsRepository } from "src/common/services/queue/sqs.repository";

@Injectable({scope: Scope.TRANSIENT})
export class QueueService {
  constructor(private sqsRepository: SqsRepository) {}

  async sendMessage(message: Record<any, any>): Promise<void> {
    await this.sqsRepository.sendMessage(JSON.stringify(message));
  }
}
