import { Injectable, Logger } from '@nestjs/common';
import { PasswordService, HashedPassword } from 'src/auth/password.service';
import { User, UserService } from 'src/domain-objects/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { DateTime } from 'luxon';
import { lib } from 'crypto-js';
import { AUTH_EMAIL_EXISTS_CONSTRAINT } from 'src/prisma/constraints';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService
  ) {}

  private async validatePassword(
    inputPassword: string,
    hashedPassword: HashedPassword
  ): Promise<boolean> {
    return await this.passwordService.validatePassword(
      inputPassword,
      hashedPassword
    );
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isValidPassword = await this.validatePassword(
        password,
        user.password as HashedPassword
      );
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  async validateResetToken(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const result = await this.prismaService.auth.findFirst({
      where: {
        email,
        reset_password_token: resetToken,
        reset_password_token_expiry: {
          gt: DateTime.now().toUTC().toISO(),
        },
      },
    });

    if (result?.reset_password_token === resetToken && result.email === email) {
      return true;
    }
    return false;
  }

  async generateUserCredentials(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      id: user.id,
    };
    return this.jwtTokenService.sign(payload);
  }

  /** @returns null if no user exists with the passed in email */
  async generateResetToken(email: string): Promise<string | null> {
    try {
      const resetToken = lib.WordArray.random(16).toString();

      await this.prismaService.auth.create({
        data: {
          email,
          reset_password_token: resetToken,
        },
      });
      return resetToken;
    } catch (error) {
      if (
        (error?.meta?.field_name as string)?.includes(
          AUTH_EMAIL_EXISTS_CONSTRAINT
        )
      ) {
        Logger.warn(
          'User attempted forgot password flow for non existent email'
        );
        return null;
      }
      Logger.error(
        'Failed to generateResetToken',
        error,
        JSON.stringify(error)
      );
      throw error;
    }
  }
}
