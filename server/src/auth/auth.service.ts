import { Injectable, Logger } from '@nestjs/common';
import { PasswordService, HashedPassword } from 'src/auth/password.service';
import { User, UserService } from 'src/domain-objects/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { DateTime } from 'luxon';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  private async validatePassword(inputPassword: string, hashedPassword: HashedPassword): Promise<boolean> {
    return await this.passwordService.validatePassword(inputPassword, hashedPassword);
  }

  async validateUser(email: string, password: string ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isValidPassword = await this.validatePassword(password, user.password as HashedPassword);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  async validateResetToken(email: string, resetToken: string): Promise<Boolean> {
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

  async generateResetToken(email: string): Promise<string> {
    try {
      const resetToken = crypto.randomUUID();
      this.prismaService.auth.create({
        data: {
          email,
          reset_password_token: resetToken,
        },
      });
      return resetToken;
    } catch (error) {
      Logger.error('Failed to generateResetToken');
      throw error;
    }
  }
}