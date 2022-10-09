import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
