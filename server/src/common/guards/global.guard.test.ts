import { GlobalGuard } from './global.guard';
import { Reflector } from '@nestjs/core';

describe('GuardsGuard', () => {
  it('should be defined', () => {
    expect(new GlobalGuard(new Reflector())).toBeDefined();
  });
});

