import { Module, forwardRef } from '@nestjs/common';
import { UserResolver } from 'src/domain-objects/user/user.resolver';
import { UserService } from 'src/domain-objects/user/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
