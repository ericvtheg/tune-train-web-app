import { Injectable } from '@nestjs/common';
import { PasswordService, HashedPassword } from 'src/common/auth/password.service';
import { User, UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
  ) {}

  private async validatePassword(inputPassword: string, hashedPassword: HashedPassword): Promise<boolean> {
    return await this.passwordService.validatePassword(inputPassword, hashedPassword);
  }

  // register

  async login(email: string, password: string ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isValidPassword = await this.validatePassword(password, user.password as HashedPassword);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }
}