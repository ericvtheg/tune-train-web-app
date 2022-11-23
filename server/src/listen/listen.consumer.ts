import { Injectable, Logger } from '@nestjs/common';
import { ListenService, ToBeCreatedListen } from 'src/listen/listen.service';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class ListenConsumer {
  constructor(
    private listenService: ListenService,
  ) {}

  @SqsMessageHandler(process.env.LISTEN_QUEUE_NAME as string, false)
  async consumeListenMessages(message: AWS.SQS.Message): Promise<void> {
    let listen: ToBeCreatedListen;
    const body = message.Body;
    if (body) {
      try {
        listen = JSON.parse(body);
      } catch (error) {
        Logger.error('Failed to parse listen message body', JSON.stringify(message));
        throw error;
      }
    } else {
      const error = 'Undefined message body in listen queue';
      Logger.error(error);
      throw error;
    }

    await this.listenService.createListen(listen);
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