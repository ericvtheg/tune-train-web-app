import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    console.log('hit in local auth guard');
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const args = ctx.getArgs();
    // puts graphql input arg into req.body
    req.body = args.input;
    return req;
  }
}