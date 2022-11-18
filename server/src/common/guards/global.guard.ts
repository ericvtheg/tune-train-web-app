import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean, string>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    // TODO should use one of the auth guards here
    return true;
  }
}
