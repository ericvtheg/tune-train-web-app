import { Module } from '@nestjs/common';
import { UserResolver } from 'src/domain-objects/user/user.resolver';
import { UserService } from 'src/domain-objects/user/user.service';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
