import { Module } from '@nestjs/common';
import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  providers: [UserResolver, UserService, UserRepository],
})
export class UserModule {}
