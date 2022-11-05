import { Module, DynamicModule } from "@nestjs/common";
import { QueueService } from "src/common/services/queue/queue.service";
import { SqsFactoryProvider } from "src/common/services/queue/sqs.factory";
import { SqsRepository } from "src/common/services/queue/sqs.repository";

@Module({})
export class QueueModule {
  static register(queueNameConfigPath: string): DynamicModule {
    return {
      module: QueueModule,
      providers: [
        QueueService,
        SqsFactoryProvider,
        SqsRepository
      ],
      exports: [QueueService],
    }
  }
}