import { applyDecorators, SetMetadata, UseInterceptors, CustomDecorator } from '@nestjs/common';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';


export const REQUEST_TIMEOUT = 'requestTimeout';
const SetTimeout = (timeout: number): CustomDecorator<string> => SetMetadata(REQUEST_TIMEOUT, timeout);

export function SetRequestTimeout(timeout: number) {
  return applyDecorators(
    SetTimeout(timeout),
    UseInterceptors(TimeoutInterceptor),
  );
}