import { Reflector } from '@nestjs/core';
import { GlobalGuard } from './global.guard';

describe('GuardsGuard', () => {
  it('should be defined', () => {
    expect(new GlobalGuard(new Reflector())).toBeDefined();
  });
});
