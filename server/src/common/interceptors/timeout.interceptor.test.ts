import { TimeoutInterceptor } from './timeout.interceptor';
import { Reflector } from '@nestjs/core';

describe('TimeoutInterceptor', () => {
  it('should be defined', () => {
    expect(new TimeoutInterceptor(new Reflector())).toBeDefined();
  });
});
