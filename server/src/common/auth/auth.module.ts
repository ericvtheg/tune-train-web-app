import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/common/auth/auth.service';
import { PasswordService } from 'src/common/auth/password.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from 'src/common/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/common/auth/strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.accessTokenSecret'),
          signOptions: {
            expiresIn: configService.get('jwt.accessTokenExpirationTime'),
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, PasswordService],

})
export class AuthModule {}