import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CryptService } from './crypt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.accessTokenSecret'),
          signOptions: {
            expiresIn: configService.get<string>(
              'jwt.accessTokenExpirationTime',
            ),
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptService],
  controllers: [AuthController],
  exports: [CryptService],
})
export class AuthModule {}
