import {
  applyDecorators, SetMetadata, UseInterceptors, CustomDecorator,
} from '@nestjs/common';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';

export const REQUEST_TIMEOUT = 'requestTimeout';
const SetTimeout = (max: number): CustomDecorator<string> => SetMetadata(REQUEST_TIMEOUT, max);

export function SetRequestTimeout(timeout: number) {
  return applyDecorators(
    SetTimeout(timeout),
    UseInterceptors(TimeoutInterceptor),
  );
}
