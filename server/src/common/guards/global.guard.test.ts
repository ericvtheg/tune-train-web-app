import { GlobalGuard } from './global.guard';
import { Reflector } from '@nestjs/core';

const mockContext = {
  getHandler: jest.fn(() => undefined),
};

describe('GuardsGuard', () => {
  it('should be defined', () => {
    expect(new GlobalGuard(new Reflector())).toBeDefined();
  });

  it('should return true if reflector returns true', () => {
    const mockReflector = {
      get: jest.fn(() => true),
    };

    const guard = new GlobalGuard(mockReflector as any);
    expect(guard.canActivate(mockContext as any)).toEqual(true);
  });

  it('should return false if reflector returns false', () => {
    const mockReflector = {
      get: jest.fn(() => false),
    };

    const guard = new GlobalGuard(mockReflector as any);
    expect(guard.canActivate(mockContext as any)).toEqual(false);
  });
});

