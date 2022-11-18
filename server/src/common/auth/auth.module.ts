import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/common/auth/auth.service';
import { PasswordService } from 'src/common/auth/password.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from 'src/common/auth/strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    PasswordService,
  ],
  exports: [AuthService, PasswordService],

})
export class AuthModule {}