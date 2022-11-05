import { Injectable, Scope } from '@nestjs/common';

@Injectable({scope: Scope.TRANSIENT})
export class QueueService {
  // generate presigned url to push event
}
