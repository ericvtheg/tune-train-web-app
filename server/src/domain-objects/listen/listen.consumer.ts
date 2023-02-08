import { Injectable, Logger } from '@nestjs/common';
import { ListenService, ToBeCreatedListen } from 'src/domain-objects/listen/listen.service';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class ListenConsumer {
  constructor(
    private listenService: ListenService,
  ) {}

  @SqsMessageHandler(process.env.LISTEN_QUEUE_NAME as string, false)
  async consumeListenMessages(message: AWS.SQS.Message): Promise<void> {
    const body = message.Body;
    if (!body) {
      const error = 'Undefined message body in listen queue';
      Logger.error(error);
      throw new Error(error);
    }

    try {
      const unparsedListenMessage = JSON.parse(body).Message as string;
      const listen = JSON.parse(unparsedListenMessage) as ToBeCreatedListen;
      await this.listenService.createListen(listen);
    } catch (error) {
      Logger.error('Failed to consume listen message', error, JSON.stringify(body));
      throw new Error(error);
    }
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'error')
  public onError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onError', error, JSON.stringify(message));
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'processing_error')
  public onProcessingError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onProcessingError', error, JSON.stringify(message));
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'timeout_error')
  public onTimeoutError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onTimeoutError', error, JSON.stringify(message));
  }
}