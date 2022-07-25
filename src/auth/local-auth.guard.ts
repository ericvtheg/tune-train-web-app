import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// where should this guard live?

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
