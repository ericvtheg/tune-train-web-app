import { Reflector } from '@nestjs/core';
import { TimeoutInterceptor } from './timeout.interceptor';

describe('TimeoutInterceptor', () => {
  it('should be defined', () => {
    expect(new TimeoutInterceptor(new Reflector())).toBeDefined();
  });
});
