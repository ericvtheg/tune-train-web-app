import { Module, forwardRef } from '@nestjs/common';
import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
