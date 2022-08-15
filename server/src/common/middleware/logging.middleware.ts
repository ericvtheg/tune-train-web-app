import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    const nanoId = nanoid(5);
    const timeString = `Request-response time ${nanoId} ${req.method} - ${req.originalUrl}`;
    console.time(timeString);
    res.on('finish', () => console.timeEnd(timeString));
    next();
  }
}
