import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password.service';
import { UserModule } from 'src/domain-objects/user/user.module';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthResolver } from 'src/auth/auth.resolver';

@Module({
  imports: [
    UserModule,
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
    AuthResolver,
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, PasswordService],

})
export class AuthModule {}